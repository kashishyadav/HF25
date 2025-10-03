import React, { useState, useEffect, useCallback, useRef } from 'react';
import { jsPDF } from 'jspdf';

function Note() {
    const [text, setText] = useState('');
    const textAreaRef = useRef(null); // Create a ref for the textarea

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleDownloadPdf = () => {
        const doc = new jsPDF();
        
        // Use the ref to access the most recent value of the text
        const currentText = textAreaRef.current.value; // Get the latest value from the textarea
        
        console.log(currentText);  // Check what text is being passed to the PDF
        doc.text(currentText, 10, 10, { maxWidth: 180 });

        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}_${String(currentDate.getHours()).padStart(2, '0')}-${String(currentDate.getMinutes()).padStart(2, '0')}-${String(currentDate.getSeconds()).padStart(2, '0')}`;

        doc.save(`note_${formattedDate}.pdf`);
    };

    const handleKeydown = useCallback((event) => {
        if (event.ctrlKey && event.key === '`') {
            handleDownloadPdf();
        }
    }, []); 

    useEffect(() => {
        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [handleKeydown]);

    return (
        <div>
            <div className="border border-white/20 p-6 rounded-lg bg-white/10 shadow-lg">
                <h3 className="font-semibold text-xl text-gray-800">Notepad</h3>
                <textarea
                    ref={textAreaRef} // Attach ref to the textarea
                    className="w-full h-32 mt-4 p-3 bg-transparent border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-900"
                    placeholder="Write a poem or quote here..."
                    value={text}
                    onChange={handleTextChange}
                />
            </div>
        </div>
    );
}

export default Note;
