import React from 'react';

interface IProps {
  message: string;
  imageUrl: string;
  title?: string;
}

const Message: React.FC<IProps> = ({ message, imageUrl, title }) => (
  <div className="h-[80vh] pt-20 items-center justify-center flex flex-col">
    <img src={imageUrl} alt="go" className="w-32 h-32 object-cover mx-auto" />
    <div className="font-bold my-3 text-center mt-10">
      {title && <h6 className="text-2xl font-normal leading-10"> {title} </h6>}
      <h6 className="text-2xl font-normal leading-10"> {message} </h6>
    </div>
  </div>
);

export default React.memo(Message);
