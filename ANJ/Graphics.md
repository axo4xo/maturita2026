# Graphics
### 1. The Purpose of Graphics

- **Data Visualization:** Graphics are primarily used for the visualization of given data. If you need to present complex information, you need pictures.
    
- **Human Perception:** Approximately **80%** of the information our brain processes and interprets comes from visual sources.
    
- **Presentations:** A professional presentation relies on clear visual aids (pictures, charts, titles, and subtitles) supported by **formal and precise language**.
    

### 2. Raster Graphics (Bitmap)

- **The Core Concept:** The image is constructed from a grid of tiny dots called **pixels**. Each individual pixel has a specific **location** (coordinates) and a specific **colour**.
    
- **Advantages (+):**
    
    - Very easy to render and process.
        
    - Capable of storing highly detailed, complex colour gradients (ideal for photographs).
        
- **Disadvantages (-):**
    
    - **Capacity requirements:** High-resolution bitmaps take up a massive amount of storage space.
        
    - **Problematic scaling:** The format is **not lossless**. If you zoom in or enlarge the picture, it loses quality and becomes blurry or "pixelated".
        

### 3. Vector Graphics

- **The Core Concept:** Instead of a grid of pixels, the image is drawn using mathematical formulas, specifically **Bézier curves**, lines, and polygons.
    
- **Advantages (+):**
    
    - **Unlimited scalability:** Because the image is mathematically calculated, you can scale it up infinitely. It is completely lossless and will never lose sharpness.
        
    - **Use cases:** It is the absolute standard for **technical drawings**, logos, icons, and typography.
        
    - _(Exam tip: Mention that this is exactly how `.svg` files work on the web)._### Vector Graphics (Continued)

- **Disadvantages (-):**
    
    - **No Photorealism:** Vectors are terrible for photographs. Because they rely on mathematical shapes and paths, they cannot easily capture the millions of tiny details, textures, and complex shadows found in the real world. If you try to make a vector photo, it will usually look flat, artificial, or like a cartoon.
        
    - **Processing Power (Slow Rendering):** You noted that bitmaps are "easy to render." The opposite is true here. Because vectors are mathematical formulas (Bézier curves), the computer's CPU has to calculate all that math every single time you open, move, or zoom into the file. If a vector image is too complex, it can actually slow down the system.
        
    - **Creation Process:** You cannot just "snap a photo" to create a vector. They have to be manually drawn in specialized software (like Adobe Illustrator or Figma) or traced from a bitmap, which requires specific skills and takes time.