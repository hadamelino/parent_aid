import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';


function App() {

  let [story, setStory] = useState("");
  let [moral, setMoral] = useState("");
  let [audioReady, setAudioReady] = useState("");
  let [isLoading, setIsLoading] = useState(false);

  async function generateTapped(event) {
    event.preventDefault();

    setIsLoading(true);
    console.log(`Tapped will generate a story with moral: ${moral}`);
    const result = await axios.post("http://localhost:3001/generateStory", { moral: moral });
    console.log(moral);
    console.log(result.data.story);
    await axios.post("http://localhost:3001/synthesize", {text: result.data.story});
    setStory(result.data.story);
    setAudioReady("http://localhost:3001/speech.mp3");
    setIsLoading(false);
  }

  function handleMoralChange(event) {
    const chosenMoral = event.target.value;
    setMoral(chosenMoral)
  }

  return (
    <div className='container mx-5 my-5 main-content'>

      { isLoading && <div class="overlay">
        <div class="overlay__inner">
          <div class="overlay__content"><span class="spinner"></span></div>
        </div>
      </div>
      }
      
      <h1 className='mb-4'>Parent <span className='AI-span text-decoration-underline'>AI</span>d</h1>
      <div className='row'>
        <div class="col-md-6 pe-4">
          <form id="my-form" onSubmit={generateTapped}>
            <label for="country" class="form-label">Moral of the story: </label>
              <select class="form-select" id="country" required="true" name="moral" onChange={handleMoralChange}>
                <option value="">Choose...</option>
                <option>Honesty</option>
                <option>Kindness</option>
                <option>Hard Work</option>
                <option>Courage and Bravery</option>
                <option>Friendship and Loyalty</option>
                <option>Sharing is Caring</option>
                <option>Responsibility and Accountability</option>
              </select>
              <button class="btn mt-3 generate-button" type="submit"><b>Generate</b></button>
          </form>

        </div>

        <div class="col-md-6 ps-4">
              <label for="generatedStory" class="form-label">Generated Story:</label>
              <div className='generated-story-box'>
                <p className='px-4 py-4'>{story}</p>
              </div>
              { (audioReady && !isLoading) ? <audio controls src="http://localhost:3001/speech.mp3" className='mt-3'/> : null }
        </div>
      </div>
      
    </div>
  )
}

export default App;
