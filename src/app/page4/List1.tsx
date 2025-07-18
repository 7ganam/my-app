"use client";
import { useEffect, useRef } from "react";
import "./style.css";
import { Swapy } from "swapy";
import { createSwapy } from "swapy";

function List1() {
  const swapyRef = useRef<Swapy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current, {
        // animation: 'dynamic'
        // swapMode: 'drop',
        // autoScrollOnDrag: true,
        // enabled: true,
        // dragAxis: 'x',
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
      <div className="slot top" data-swapy-slot="list1-a">
        <div className="item item-a" data-swapy-item="list1-a">
          <div>A</div>
        </div>
      </div>
      <div className="middle">
        <div className="slot middle-left" data-swapy-slot="list1-b">
          <div className="item item-b" data-swapy-item="list1-b">
            <div className="handle" data-swapy-handle></div>
            <div>B</div>
          </div>
        </div>
        <div className="slot middle-right" data-swapy-slot="list1-c"></div>
      </div>
      <div className="slot bottom" data-swapy-slot="list1-d">
        <div className="item item-d" data-swapy-item="list1-d">
          <div>D</div>
        </div>
      </div>
    </div>
  );
}

export default List1;
