import numpy as np
from numpy.random import default_rng
import matplotlib.pyplot as plt
from scipy.fft import fft


def generate_probs(cycles=1, rng=default_rng()):
    freqs = np.array([2, 3, 5, 11])
    trials_per_cycle = np.prod(freqs)
    base_amp = 0.889 # max amp is ~1, after summing
    amps = base_amp / freqs
    amps = np.array((0.25, 0.25, 0.25, 0.25))
    phases = rng.uniform(0, 2*np.pi, freqs.size)
    t = np.arange(0, cycles, 1 / trials_per_cycle)
    out = np.zeros(trials_per_cycle * cycles)
    for i in range(freqs.size):
        out += amps[i] * np.cos(2 * np.pi * freqs[i] * t + phases[i])
    # take [-1, 1] (approx) and put on [0, 1]
    out /= 2
    out += 0.5
    return out

cycles = 1
n_sims = 1
vals = np.empty((n_sims, 330 * cycles))
rng = default_rng()
for i in range(vals.shape[0]):
    vals[i, :] = generate_probs(cycles, rng)

out = rng.binomial(1, vals)
plt.plot(vals.T, label='P(Reward)')
plt.plot(out.T, '.', label='Reward')
plt.legend()
plt.xlabel('Trials')
plt.ylabel('Reward')
plt.title('Simulated reward schedule & potential outcome')
plt.show()

n = 330 * cycles
t = 1 / 330
x = np.arange(0, cycles, 1/n)
y = vals[0,:] - np.mean(vals[0,:])
yf = fft(y)
xf = np.arange(0, n//2, cycles)
# xf = np.linspace(0, 1.0 / (2.0 * t), n // 2)
plt.plot(xf, 2.0 / n * np.abs(yf[:n // 2]))
plt.grid()
plt.title('FFT of <-')
plt.show()