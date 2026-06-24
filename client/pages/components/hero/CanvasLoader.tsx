import { Html, useProgress } from "@react-three/drei";

const CanvasLoader = () => {
  const { progress } = useProgress();

  return (
    <Html as="div" center>
      <div className="flex flex-col items-center justify-center">
        <span className="w-10 h-10 rounded-full border-4 border-[#22D3EE]/30 border-t-[#22D3EE] animate-spin" />
        <p className="text-sm text-[#F4F4F4] font-semibold mt-4">
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
};

export default CanvasLoader;