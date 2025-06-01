import React from 'react';

interface prop {
    text: string;
}

const LineText: React.FC<prop> = ({ text }) => {
    return (
      <div className="flex items-center w-full mx-auto ">
        <span className="flex-1 border-t"></span>
        <span className="px-4 text-center flex items-center font-light pb-1">{text}</span>
        <span className="flex-1 border-t"></span>
      </div>
    );
};

export default LineText;