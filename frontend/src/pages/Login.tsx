import React from "react";

export const Login = () => {
  return (
    <>
      <div className="login-container">
        <div className="left-side w-1/2 h-screen bg-gray-600 flex justify-center items-center">
          <div className="flex flex-col items-start space-y-10">
            <h1 className="text-4xl font-bold">PolicyExpert</h1>
            <p className="">
              Ask questions. Get answers from your company policies, with source
            </p>
            <ul className="flex flex-col list-inside text-gray-500 space-y-1">
              <li className="">Answers grounded in document</li>
              <li className="">Source citations on every reply</li>
            </ul>
          </div>
        </div>
        <div className="right-side"></div>
      </div>
    </>
  );
};
