import numpy as np
from PIL import Image
import math
import time

def test_gif():
    t0 = time.time()
    # Create a dummy 512x512 image
    base = np.zeros((512, 512, 3), dtype=np.uint8)
    base[200:300, 200:300] = [255, 0, 0]
    
    frames = []
    for i in range(10):
        t = i / 10.0 * 2 * math.pi
        dy = int(math.sin(t) * 10)
        
        # Roll for float effect
        frame = np.roll(base, dy, axis=0)
        
        # Red tint
        # Just a simple example
        frame = frame.astype(np.float32)
        frame[:,:,0] = np.clip(frame[:,:,0] + 20, 0, 255)
        frames.append(Image.fromarray(frame.astype(np.uint8)))

    frames[0].save('test.gif', save_all=True, append_images=frames[1:], duration=100, loop=0)
    print(f"Time to create 1 GIF: {time.time() - t0:.3f}s")

if __name__ == '__main__':
    test_gif()
