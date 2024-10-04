import React, { useState } from 'react';
import axios from 'axios';

const SpellCheckForm = () => {
    const [text, setText] = useState(""); // For the input text
    const [correctedText, setCorrectedText] = useState(""); // For the corrected text result
    const [loading, setLoading] = useState(false); // Loading state for API call

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form refresh
        setLoading(true); // Start loading
        setCorrectedText(""); // Reset corrected text while loading
    
        try {
            const response = await axios.post('http://localhost:5000/api/spellcheck', { text: text }); // Ensure the correct port is used
            setCorrectedText(response.data.corrected_text); // Corrected text field must match your Flask API response
        } catch (error) {
            console.error("There was an error with the API", error);
        } finally {
            setLoading(false); // End loading after API call completes
            setText(""); // Clear the input text after submission
        }
    };
    

    return (
        <div>
            <h1>Text Correction Tool</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows="6"
                    cols="50"
                    placeholder="Enter your text here..."
                    required // Ensure input is not empty
                />
                <br />
                <button type="submit" disabled={loading}> {/* Disable button while loading */}
                    {loading ? 'Submitting...' : 'Submit for Correction'}
                </button>
            </form>

            {correctedText && (
                <div>
                    <h2>Corrected Text</h2>
                    <p>{correctedText}</p>
                </div>
            )}
        </div>
    );
};

export default SpellCheckForm;
