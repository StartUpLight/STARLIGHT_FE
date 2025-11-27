import Button from '@/app/_components/common/Button';
import Check from '@/assets/icons/puple_check.svg';

interface PricingItemProps {
  title: string;
  description: string;
  price: string;
  cycle: string;
  highlight: string;
  features: string[];
  background?: string;

  onClick?: () => void;
  disabled?: boolean;
}

const PricingItem = ({
  title,
  description,
  price,
  cycle,
  highlight,
  features,
  background,
  onClick,
  disabled,
}: PricingItemProps) => {
  return (
    <div
      className={`flex w-full flex-col items-start gap-6 rounded-xl border border-gray-300 px-6 pt-6 pb-8 ${
        background ? background : 'bg-white'
      }`}
    >
      <div className="flex flex-col items-start text-gray-900">
        <div className="ds-heading font-semibold">{title}</div>

        <span className="ds-subtext mt-1 font-medium">{description}</span>

        <div className="ds-title mt-4 font-semibold">
          {price}
          <span className="ds-subtext font-medium text-gray-500">
            {' '}
            / {cycle}
          </span>
        </div>
      </div>

      <Button
        text="구매하기"
        size="L"
        color="primary"
        className="ds-text h-11 w-full rounded-lg px-8 py-2.5"
        onClick={() => {
          onClick?.();
        }}
        disabled={disabled}
      />

      <div className="flex w-full flex-col items-start gap-2">
        <div className="text-primary-500 ds-subtext font-semibold">
          {highlight}
        </div>

        <div className="flex flex-row items-center gap-2">
          <Check />
          <div className="ds-subtext font-medium text-gray-800">
            {features[0]}
          </div>
        </div>

        <div className="ds-caption flex w-full flex-col gap-1 px-6 font-medium text-gray-600">
          {features.slice(1).map((feature, id) => (
            <li key={id}>{feature}</li>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PricingItem;
