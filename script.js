async function simplifyVerse() {
    const verseInput = document.getElementById('verseInput').value.trim();
    const level = document.getElementById('levelSelect').value;
    const errorEl = document.getElementById('error');
    const originalVerseEl = document.getElementById('originalVerse');
    const simplifiedExplanationEl = document.getElementById('simplifiedExplanation');
    
    // Clear previous error
    errorEl.textContent = '';
    
    // Parse input (e.g., "1.1" to chapter 1, verse 1)
    const match = verseInput.match(/(?:BG\s*)?(\d+)\.(\d+)/i);
    
    if (!match) {
      errorEl.textContent = 'Please enter a valid verse format (e.g., 1.1)';
      return;
    }
  
    const chapter = match[1];
    const verse = match[2];
    
    try {
      // Show loading state
      originalVerseEl.textContent = 'Loading...';
      simplifiedExplanationEl.textContent = '';
      
      // Fetch verse from the API
      const response = await fetch(`https://vedicscriptures.github.io/slok/${chapter}/${verse}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Display original verse
      originalVerseEl.textContent = data.slok || 'Verse text not available';
      
      // Generate simplified explanation based on level
      let explanation = '';
      
      if (level === 'beginner') {
        explanation = data.purohit?.et || data.siva?.et || 'Translation not available'; // Use English translations
      } else if (level === 'medium') {
        explanation = `${data.purohit?.et || data.siva?.et || 'Translation not available'}\n\nAdditional context: ${data.siva?.ec || 'Not available'}`;
      } else {
        // Advanced level - combine translations with commentary
        explanation = `${data.purohit?.et || data.siva?.et || 'Translation not available'}\n\n${data.chinmay?.hc || data.rams?.hc || 'Commentary not available'}`;
      }
      
      simplifiedExplanationEl.textContent = explanation;
      
    } catch (err) {
      errorEl.textContent = 'Failed to fetch verse data. Please check your input and try again.';
      originalVerseEl.textContent = 'Error occurred';
      simplifiedExplanationEl.textContent = '';
      console.error(err);
    }
  }
  
  // Add event listener to the button
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('simplifyBtn').addEventListener('click', simplifyVerse);
  });
  