import React, { useState } from 'react';

function PopupWindow() {
  const [isOpen, setIsOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      {/* <button onClick={openPopup}>Open Popup</button> */}

   
        <div className="popup">
          <label htmlFor="inputText">Enter some text:</label>
          <input
            type="text"
            id="inputText"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button onClick={closePopup}>Close</button>
        </div>
     
    </div>
  );
}

export default PopupWindow;
