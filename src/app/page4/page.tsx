"use client";
import { useEffect, useRef } from "react";
import "./style.css";
import { Swapy } from "swapy";
import { createSwapy } from "swapy";

function App() {
  const swapyRef = useRef<Swapy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current, {
        // animation: 'dynamic'
        // swapMode: 'drop',
        // autoScrollOnDrag: true,
        // enabled: true,
        // dragAxis: 'y', // Changed to y for vertical dragging
        // dragOnHold: true
      });

      // swapyRef.current.enable(false)
      // swapyRef.current.destroy()
      // console.log(swapyRef.current.slotItemMap())

      swapyRef.current.onBeforeSwap((event) => {
        console.log("beforeSwap", event);
        // This is for dynamically enabling and disabling swapping.
        // Return true to allow swapping, and return false to prevent swapping.
        return true;
      });

      swapyRef.current.onSwapStart((event) => {
        console.log("start", event);
      });
      swapyRef.current.onSwap((event) => {
        console.log("swap", event);
      });
      swapyRef.current.onSwapEnd((event) => {
        console.log("end", event);
      });
    }
    return () => {
      swapyRef.current?.destroy();
    };
  }, []);
  return (
    <div className="container" ref={containerRef}>
      <div className="slot" data-swapy-slot="item-1">
        <div className="item item-1" data-swapy-item="item-1">
          <div className="handle" data-swapy-handle></div>
          <div>Item 1</div>
        </div>
      </div>
      <div className="slot" data-swapy-slot="item-2">
        <div className="item item-2" data-swapy-item="item-2">
          <div className="handle" data-swapy-handle></div>
          <div>Item 2</div>
        </div>
      </div>
      <div className="slot" data-swapy-slot="item-3">
        <div className="item item-3" data-swapy-item="item-3">
          <div className="handle" data-swapy-handle></div>
          <div>Item 3</div>
        </div>
      </div>
      <div className="slot" data-swapy-slot="item-4">
        <div className="item item-4" data-swapy-item="item-4">
          <div className="handle" data-swapy-handle></div>
          <div>Item 4</div>
        </div>
      </div>
      <div className="slot" data-swapy-slot="item-5">
        <div className="item item-5" data-swapy-item="item-5">
          <div className="handle" data-swapy-handle></div>
          <div>Item 5</div>
        </div>
      </div>
    </div>
  );
}

export default App;
