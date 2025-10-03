import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

function Notepad() {
  const [markdownText, setMarkdownText] = useState('');
  const [savedBlocks, setSavedBlocks] = useState([]);

  useEffect(() => {
    const blocks = JSON.parse(localStorage.getItem('markdownBlocks')) || [];
    setSavedBlocks(blocks);
  }, []);

  useEffect(() => {
    if (savedBlocks.length > 0) {
      localStorage.setItem('markdownBlocks', JSON.stringify(savedBlocks));
    }
  }, [savedBlocks]);

  const handleChange = (event) => {
    setMarkdownText(event.target.value);
  };

  const handleSave = () => {
    if (markdownText.trim() !== '') {
      const newBlock = {
        id: Date.now(),
        markdown: markdownText
      };
      setSavedBlocks((prevBlocks) => [...prevBlocks, newBlock]);
      setMarkdownText('');
    }
  };

  const handleDelete = (id) => {
    setSavedBlocks((prevBlocks) => prevBlocks.filter(block => block.id !== id));
  };

  const handleEdit = (block) => {
    setMarkdownText(block.markdown);
  };

  const renderMarkdown = (text) => {
    return { __html: marked(text) };
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <textarea
            value={markdownText}
            onChange={handleChange}
            className="w-full h-80 p-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your markdown here..."
          ></textarea>
          <div className="mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </div>

        <div className="h-80 overflow-y-auto p-4 border rounded-md shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-4">Saved Blocks</h3>
          <div className="space-y-4">
            {savedBlocks.map((block) => (
              <div key={block.id} className="p-4 border rounded-md shadow-sm">
                <div
                  className="mb-2 text-lg font-medium cursor-pointer"
                  onClick={() => handleEdit(block)}
                >
                  Block #{block.id}
                </div>
                <div
                  className="mb-2"
                  dangerouslySetInnerHTML={renderMarkdown(block.markdown)}
                />
                <button
                  onClick={() => handleDelete(block.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notepad;
