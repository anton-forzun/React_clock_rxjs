import React, { useMemo } from "react";

import { useEffect, useState } from "react";
import { interval, Subject } from "rxjs";
import { buffer, debounceTime, filter, map, takeUntil } from "rxjs/operators";

import "./App.scss";
 
type Prop = "run" | "stop" | "wait";
 
export default function App() {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState<Prop>("stop");
  const click = useMemo(() => new Subject(), []);
 
  useEffect(() => {
    const sub = new Subject();

    const doubleClick = click.pipe(
      buffer(click.pipe(debounceTime(250))),
      map((list) => list.length),
      filter((val) => val >= 2),
    );

     interval(1000)
      .pipe(takeUntil(doubleClick))
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
    setStatus("run");
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
