import './style.css';

import { of, map, Observable } from 'rxjs';

of('World')
  .pipe(map((name) => `Hello, ${name}!`))
  .subscribe(console.log);

// Open the console in the bottom right to see results.

// Basic clock
import { timer, interval, take, tap, reduce, scan, shareReplay } from 'rxjs';

const output = document.createElement('output');
document.body.prepend(output);

timer(0, 1000)
  .pipe(map(() => new Date().toLocaleTimeString()))
  .subscribe(time => (output.textContent = time));

// obsExample() {
    const obs1= interval(1000)
      .pipe(
        take(5),
        map(i => i *2),
        tap(i => console.log("obs value "+ i) )
      );
  
    obs1.subscribe(value => console.log("observer 1 received " + value));
  
    obs1.subscribe(value => console.log("observer 2 received " + value));
//    }
  
//    obsReduceExample() {
      const obs2 = interval(500).pipe(take(5));
  
      var reduced = obs2.pipe(
        reduce((state, value) => state + value , 0)
      );
  
      reduced.subscribe(total => console.log("totalReduced =" + total));
//    }
  
//    obsScanExample() {
      const obs3 = interval(500).pipe(take(5));
  
      var scanObs = obs3.pipe(
        scan((state, value) => state + value , 0)
      );
  
      scanObs.subscribe(total => console.log("scanning =" + total));
//    }
  
//    obsShareExample() {
      const obs4 = interval(500)
        .pipe(
          take(5),
          tap(i => console.log("obs value "+ i)),
          shareReplay()
        );
  
      obs4.subscribe(value => console.log("observerShare 1 received " + value));
  
      obs4.subscribe(value => console.log("observerShare 2 received " + value));
//    }