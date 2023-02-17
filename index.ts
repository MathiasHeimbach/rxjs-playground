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

// Movable Element
import { fromEvent, exhaustMap, takeUntil } from 'rxjs';

const target = document.createElement('div');
target.setAttribute(
  'style',
  'position: absolute; top: 0; left: 0; background-color: red; width: 50px; height: 50px;'
);
document.body.append(target);

fromEvent(target, 'mousedown')
  .pipe(
    exhaustMap(() =>
      fromEvent(document, 'mousemove').pipe(
        takeUntil(fromEvent(document, 'mouseup'))
      )
    )
  )
  .subscribe(({ pageX, pageY }: MouseEvent) => {
    target.style.transform = `translate3d(${pageX}px, ${pageY}px, 0)`;
  });


// Animated Dot Trail
import {
  defer,
  animationFrames,
  mergeMap,
  takeWhile,
  finalize
} from 'rxjs';

// When the mouse moves, add animated dots to the screen.
fromEvent(document, 'mousemove')
  .pipe(mergeMap((e: MouseEvent) => addDot(e.pageX, e.pageY)))
  .subscribe();

function addDot(x: number, y: number) {
  return defer(() => {
    // Create and add the dot element when
    // the observable is subscribed to
    const dot = document.createElement('div');
    dot.setAttribute(
      'style',
      `
        position: absolute;
        top: 0;
        left: 0;
        width: 10px;
        height: 10px;
        background-color: lime;
        border-radius: 50%;
        transform: translate3d(${x}px, ${y}px, 0);
      `
    );
    document.body.append(dot);

    const xVelocity = Math.random() * 2 - 1;
    const yVelocity = Math.random() * 2 - 1;

    return animationFrames().pipe(
      // Only take animation frames for 1 second.
      takeWhile(({ elapsed }) => elapsed < 1000),

      // Track and update the current position.
      scan(
        ({ x: xCurrent, y: yCurrent }) => ({
          x: xCurrent + xVelocity,
          y: yCurrent + yVelocity
        }),
        { x, y }
      ),

      // Set the position on the dot as a side-effect.
      tap(({ x, y }) => {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }),

      // When we clean up, remove the element.
      finalize(() => {
        dot.remove();
      })
    );
  });
}
      
      



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

