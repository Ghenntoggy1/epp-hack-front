import { Button, Link } from "@nextui-org/react";
import React from "react";

export const Hero = () => {
  return (
    <div className="mt-[-68px] h-[85vh] w-full rounded-bl-[200px] bg-primary-700 pt-[80px] text-white">
      <div className="container flex h-full items-center justify-between">
        <div className="max-w-[800px]">
          <h1 className="text-[64px] font-bold leading-tight">Enhance Your Erasmus+ Experience</h1>
          <p className="my-10 text-xl">
            Find the Best Suitable Student Exchange Offers for You. 
            <br />
            Do not miss the opportunity to be a part of the Erasmus+ program.
          </p>
          <div className="flex space-x-6">
            <Link href="/opportunities">
              <Button color="primary" className="bg-white font-bold text-primary-800" size="lg">
                View opportunites
              </Button>
            </Link>
            <Link href="/learn-more">
              <Button
                color="primary"
                className="bg-white bg-opacity-80 font-bold text-primary-800"
                size="lg"
              >
                Learn more
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative ml-10 w-full">
          <img src="/images/p034305002101-704290.jpg" width={"80%"} height={"80%"} className="h-auto min-w-[760px] animate-bounce" />
        </div>
      </div>
    </div>
  );
};
