%% simulate an RL model using the smith perturbation frequency stuff
%% SDM; Oakland CA; March 21st 2020; the Corno era
clear all;close all;clc;

% number of trials
ntrials = 1000;

%% reward probability schedule %%
% sum-of-sines
% 4 pure sine wave components with amplitude=30
freq = [20 10 4 2];
amp = .30;
for k = 1:length(freq)
    dt = 1/ntrials;
    t = (0:dt:1-dt)';
    y(k,:) = amp * sin(2*pi*freq(k)*t);
end
prob_sched = sum(y); % prob of bandit one giving reward
plot(prob_sched / 2 + 0.5);

na = 2; % # of bandits

%% Toy Fast/Slow RL model %%
alpha_f = 1;
alpha_s = .1;
beta_f = 2;
beta_s = 1;
w = .9;

qf = .5*ones(na,1);
qs = .5*ones(na,1);
Q_fast = nan(ntrials,2);
Q_slow = nan(ntrials,2);


for n = 1:ntrials    
    pol_f = (exp(qf.*beta_f) ./ sum(exp(qf.*beta_f)))';
    pol_s = (exp(qs.*beta_s) ./ sum(exp(qs.*beta_s)))';
    pol = w*pol_f + (1-w)*pol_s;    
    
    x = rand;
    cnt = histcounts(x,[0,cumsum(pol)]);
    a = find(cnt==1); % action
    a_store(n) = a;
    rprob = prob_sched(n);
    coin = rand; 
    % rewarded?
    if a == 1
        if coin < rprob
            r = 1;
        else
            r = 0;
        end
    else
        if coin < 1-rprob
            r = 1;
        else
            r = 0;
        end
    end
    % q learn
    qf(a) = qf(a) + alpha_f*(r-qf(a));
    qs(a) = qs(a) + alpha_s*(r-qs(a));    
    
    Q_fast(n,a) = qf(a);
    Q_fast(n,3-a) = qf(3-a);    
    Q_slow(n,a) = qs(a);
    Q_slow(n,3-a) = qs(3-a);             
    
end

plot(prob_sched,'--k');hold on;
plot(Q_fast(:,1)-.5,'o');
legend('Bandit 1 reward probability schedule','model simulated Q-values');


figure;
% Driven frequencies
ntrials = length(prob_sched);
Ts = mean(diff(t));
Fs = 1/Ts;
Fn = Fs/2;
FT_Signal = fft(prob_sched)/ntrials;
Fv = linspace(0, 1, fix(ntrials/2)+1)*Fn;
Iv = 1:length(Fv);
plot(Fv, abs(FT_Signal(Iv))*2,'--k','linewidth',2); hold on;

% SIM Q action = 1 slow RL
FT_Signal = fft(Q_fast(:,1))/ntrials;
plot(Fv, abs(FT_Signal(Iv))*2,'color','b','linewidth',2)
% SIM Q action = 1 fast RL
FT_Signal = fft(Q_slow(:,1))/ntrials;
plot(Fv, abs(FT_Signal(Iv))*2,'color','r','linewidth',2)
% SIM choices 
FT_Signal = fft(a_store)/ntrials;
plot(Fv, abs(FT_Signal(Iv))*2,'color','m','linewidth',2)

xlim([1 21]);
box off;
title('Freq. Analysis');
xlabel('Freq');
ylabel('Amplitude');


% un-driven frequencies?
% figure;
% freq = [freq max(freq):ntrials];
% 
% signal_fast = fft(Q_fast(:,1));
% signal_fast(freq) = 0;
% signal_fast = ifft(signal_fast);
% signal_fast = real(signal_fast);
% 
% signal_slow = fft(Q_slow(:,1));
% signal_slow(freq) = 0;
% signal_slow = ifft(signal_slow);
% signal_slow = real(signal_slow);
% 
% plot(signal_fast,'color','b');hold on;
% plot(signal_slow,'color','r');
% ylabel('P(a = 1)');
% xlabel('Trial');
% title('Perturbation Free???');

