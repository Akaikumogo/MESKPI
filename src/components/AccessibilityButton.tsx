import { useFontSize } from '@/Providers/Accessibilty';
import { Button } from 'antd';
import { AArrowUp, AArrowDown } from 'lucide-react';

const AccessibilityControls = () => {
  const { increaseFontSize, decreaseFontSize, canIncrease, canDecrease } =
    useFontSize();

  return (
    <div className="flex gap-2">
      <Button
        aria-label="Decrease text size"
        disabled={!canDecrease}
        onClick={decreaseFontSize}
        size="large"
      >
        <AArrowDown />
      </Button>
      <Button
        aria-label="Increase text size"
        disabled={!canIncrease}
        onClick={increaseFontSize}
        size="large"
      >
        <AArrowUp />
      </Button>
    </div>
  );
};

export default AccessibilityControls;
