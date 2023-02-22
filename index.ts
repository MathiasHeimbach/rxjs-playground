import './style.css';

import { of, map, Observable, Observer } from 'rxjs';

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



// --------------------
// https://angular.io/guide/observables
// --------------------

// Create simple observable that emits three values
const myObservable = of(1, 2, 3);

// Create observer object
const myObserver = {
  next: (x: number) => console.log('Observer got a next value: ' + x),
  error: (err: Error) => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};

// Execute with the observer object
myObservable.subscribe(myObserver);

// Logs:
// Observer got a next value: 1
// Observer got a next value: 2
// Observer got a next value: 3
// Observer got a complete notification

// --------------------
myObservable.subscribe(
  x => console.log('Observer got a next value: ' + x),
  err => console.error('Observer got an error: ' + err),
  () => console.log('Observer got a complete notification')
);

// This function runs when subscribe() is called
function sequenceSubscriber(observer: Observer<number>) {
  // synchronously deliver 1, 2, and 3, then complete
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();

  // unsubscribe function doesn't need to do anything in this
  // because values are delivered synchronously
  return {unsubscribe() {}};
}

// Create a new Observable that will deliver the above sequence
const sequence = new Observable(sequenceSubscriber);

// execute the Observable and print the result of each notification
sequence.subscribe({
  next(num) { console.log(num); },
  complete() { console.log('Finished sequence'); }
});

// Logs:
// 1
// 2
// 3
// Finished sequence

// --------------------
function sequenceSubscriber2(observer: Observer<number>) {
  const seq = [1, 2, 3];
  let timeoutId: any;

  // Will run through an array of numbers, emitting one value
  // per second until it gets to the end of the array.
  function doInSequence(arr: number[], idx: number) {
    timeoutId = setTimeout(() => {
      observer.next(arr[idx]);
      if (idx === arr.length - 1) {
        observer.complete();
      } else {
        doInSequence(arr, ++idx);
      }
    }, 1000);
  }

  doInSequence(seq, 0);

  // Unsubscribe should clear the timeout to stop execution
  return {
    unsubscribe() {
      clearTimeout(timeoutId);
    }
  };
}

// Create a new Observable that will deliver the above sequence
const sequence2 = new Observable(sequenceSubscriber2);

sequence2.subscribe({
  next(num) { console.log(num); },
  complete() { console.log('Finished sequence'); }
});

// Logs:
// (at 1 second): 1
// (at 2 seconds): 2
// (at 3 seconds): 3
// (at 3 seconds): Finished sequence

// --------------------
// with 2 subscriptions

// Subscribe starts the clock, and will emit after 1 second
sequence2.subscribe({
  next(num) { console.log('1st subscribe: ' + num); },
  complete() { console.log('1st sequence finished.'); }
});

// After 1/2 second, subscribe again.
setTimeout(() => {
  sequence2.subscribe({
    next(num) { console.log('2nd subscribe: ' + num); },
    complete() { console.log('2nd sequence finished.'); }
  });
}, 500);

// Logs:
// (at 1 second): 1st subscribe: 1
// (at 1.5 seconds): 2nd subscribe: 1
// (at 2 seconds): 1st subscribe: 2
// (at 2.5 seconds): 2nd subscribe: 2
// (at 3 seconds): 1st subscribe: 3
// (at 3 seconds): 1st sequence finished
// (at 3.5 seconds): 2nd subscribe: 3
// (at 3.5 seconds): 2nd sequence finished

//-----------------
// multicasting

function multicastSequenceSubscriber() {
  const seq = [1, 2, 3];
  // Keep track of each observer (one for every active subscription)
  const observers: Observer<unknown>[] = [];
  // Still a single timeoutId because there will only ever be one
  // set of values being generated, multicasted to each subscriber
  let timeoutId: any;

  // Return the subscriber function (runs when subscribe()
  // function is invoked)
  return (observer: Observer<unknown>) => {
    observers.push(observer);
    // When this is the first subscription, start the sequence
    if (observers.length === 1) {
      const multicastObserver: Observer<number> = {
        next(val) {
          // Iterate through observers and notify all subscriptions
          observers.forEach(obs => obs.next(val));
        },
        error() { /* Handle the error... */ },
        complete() {
          // Notify all complete callbacks
          observers.slice(0).forEach(obs => obs.complete());
        }
      };
      doSequence(multicastObserver, seq, 0);
    }

    return {
      unsubscribe() {
        // Remove from the observers array so it's no longer notified
        observers.splice(observers.indexOf(observer), 1);
        // If there's no more listeners, do cleanup
        if (observers.length === 0) {
          clearTimeout(timeoutId);
        }
      }
    };

    // Run through an array of numbers, emitting one value
    // per second until it gets to the end of the array.
    function doSequence(sequenceObserver: Observer<number>, arr: number[], idx: number) {
      timeoutId = setTimeout(() => {
        console.log('Emitting ' + arr[idx]);
        sequenceObserver.next(arr[idx]);
        if (idx === arr.length - 1) {
          sequenceObserver.complete();
        } else {
          doSequence(sequenceObserver, arr, ++idx);
        }
      }, 1000);
    }
  };
}

// Create a new Observable that will deliver the above sequence
const multicastSequence = new Observable(multicastSequenceSubscriber());

// Subscribe starts the clock, and begins to emit after 1 second
multicastSequence.subscribe({
  next(num) { console.log('1st subscribe: ' + num); },
  complete() { console.log('1st sequence finished.'); }
});

// After 1 1/2 seconds, subscribe again (should "miss" the first value).
setTimeout(() => {
  multicastSequence.subscribe({
    next(num) { console.log('2nd subscribe: ' + num); },
    complete() { console.log('2nd sequence finished.'); }
  });
}, 1500);

// Logs:
// (at 1 second): Emitting 1
// (at 1 second): 1st subscribe: 1
// (at 2 seconds): Emitting 2
// (at 2 seconds): 1st subscribe: 2
// (at 2 seconds): 2nd subscribe: 2
// (at 3 seconds): Emitting 3
// (at 3 seconds): 1st subscribe: 3
// (at 3 seconds): 2nd subscribe: 3
// (at 3 seconds): 1st sequence finished
// (at 3 seconds): 2nd sequence finished

