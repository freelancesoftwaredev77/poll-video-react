import React from 'react';

interface IProps {
  message: string;
  imageUrl: string;
  title?: string;
}

const Message: React.FC<IProps> = ({ message, imageUrl, title }) => (
  <div className="flex h-[80vh] flex-col items-center justify-center pt-20">
    <img src={imageUrl} alt="go" className="mx-auto h-32 w-32 object-cover" />
    <div className="my-3 mt-10 text-center font-bold">
      {title && <h6 className="text-2xl font-normal leading-10"> {title} </h6>}
      <h6 className="text-2xl font-normal leading-10"> {message} </h6>
    </div>
  </div>
);

export default React.memo(Message);
