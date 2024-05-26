import React from 'react';

interface IProps {
  message: string;
}

const Congrats: React.FC<IProps> = ({ message }) => (
  <div className="h-[80vh] pt-20 items-center justify-center flex flex-col">
    <img src="/go.png" alt="go" className="w-32 h-32 object-cover mx-auto" />
    <div className="font-bold my-3 text-center">
      <h6>Congratulations!</h6>
      <h6> {message} </h6>
    </div>
  </div>
);

export default React.memo(Congrats);
