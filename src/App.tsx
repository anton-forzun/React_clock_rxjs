import React from "react";

import { useEffect, useState } from "react";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import "./App.scss";
 
type Prop = "run" | "stop" | "wait";
 
export default function App() {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState<Prop>("stop");
 
  useEffect(() => {
    const sub = new Subject();
    interval(1000)
      .pipe(takeUntil(sub))
      .subscribe(() => {
        if (status === "run") {
          setSec(val => val + 1000);
        }
      });
    return () => {
      sub.next(1);
      sub.complete();
    };
  }, [status]);
 
  const start = React.useCallback(() => {
    setStatus("run");
  }, []);
 
  const stop = React.useCallback(() => {
    setStatus("stop");
    setSec(0);
  }, []);
 
  const reset = React.useCallback(() => {
    setSec(0);
  }, []);
 
  const wait = React.useCallback(() => {
    setStatus("wait");
  }, []);
 
  return (
    <div>
      <span className="clock"> {new Date(sec).toISOString().slice(11, 19)}</span>
      <button className="start-button" onClick={start}>
        Start
      </button>
      <button className="stop-button" onClick={stop}>
        Stop
      </button>
      <button className="button" onClick={reset}>Reset</button>
      <button className="button" onClick={wait}>Wait</button>
    </div>
  );
}
