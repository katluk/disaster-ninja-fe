import { i18n } from '~core/localization';
import { TooltipWrapper } from '~components/Tooltip';
import styles from './style.module.css';

interface DenominatorIconProps {
  iconId: string;
}

const PopulationIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_4777_147920)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.59226 5.6715C4.57385 5.68982 4.55581 5.70848 4.53814 5.72748C4.27818 6.00698 4.09843 6.3591 4.03058 6.74363C4.30836 6.45062 4.50699 6.08183 4.59226 5.6715ZM10.3266 5.66248C10.4117 6.0808 10.6146 6.45633 10.8991 6.75295C10.8325 6.3648 10.6519 6.00926 10.3899 5.7275C10.3693 5.70537 10.3482 5.68368 10.3266 5.66248ZM10.927 7.12889C10.2881 7.58142 9.93487 8.39557 10.1356 9.23105L10.3024 9.92533L10.8712 7.55816C10.9059 7.41385 10.924 7.27018 10.927 7.12889ZM10.8167 12.0655L11.135 13.3906C11.2431 13.8401 11.6451 14.157 12.1074 14.157H12.8928C13.3551 14.157 13.7571 13.8401 13.8651 13.3906L14.8646 9.23105C15.0886 8.29843 14.6225 7.39238 13.8391 6.98624C14.3731 6.58123 14.718 5.93987 14.718 5.21796C14.718 3.99301 13.725 3 12.5001 3C12.1224 3 11.7669 3.09436 11.4556 3.26079C11.4174 3.85333 11.25 4.41104 10.9816 4.90556C11.0898 5.00751 11.1903 5.11726 11.2822 5.23375C11.2821 5.22849 11.2821 5.22323 11.2821 5.21796C11.2821 4.5453 11.8274 4 12.5001 4C13.1727 4 13.718 4.5453 13.718 5.21796C13.718 5.89062 13.1727 6.43592 12.5001 6.43592C12.2381 6.43592 11.9954 6.35321 11.7968 6.21249C11.9482 6.7042 11.975 7.24459 11.8435 7.79175C11.9191 7.77351 11.9983 7.7638 12.0803 7.7638H12.9199C13.5667 7.7638 14.0433 8.36854 13.8922 8.99743L12.8928 13.157L12.1074 13.157L11.3309 9.92533L10.8167 12.0655ZM4.10776 12.0505L3.78577 13.3906C3.67777 13.8401 3.27574 14.157 2.81344 14.157H2.02803C1.56574 14.157 1.16371 13.8401 1.0557 13.3906L0.0562696 9.23105C-0.167809 8.29845 0.298349 7.39241 1.08167 6.98626C0.547652 6.58125 0.202745 5.93988 0.202745 5.21796C0.202745 3.99301 1.19576 3 2.42071 3C2.80138 3 3.15965 3.0959 3.47268 3.26486C3.5114 3.85587 3.67872 4.41215 3.94647 4.90553C3.83535 5.01024 3.73236 5.12317 3.63841 5.24319C3.63858 5.2348 3.63867 5.22639 3.63867 5.21796C3.63867 4.5453 3.09337 4 2.42071 4C1.74804 4 1.20274 4.5453 1.20274 5.21796C1.20274 5.89062 1.74804 6.43592 2.42071 6.43592C2.68679 6.43592 2.93294 6.3506 3.1333 6.20582C2.98006 6.69932 2.95243 7.24213 3.0845 7.79178L3.08494 7.79363C3.00708 7.77418 2.92528 7.7638 2.84055 7.7638H2.00092C1.35413 7.7638 0.877492 8.36854 1.0286 8.99742L2.02803 13.157L2.81344 13.157L3.59353 9.91034L4.10776 12.0505ZM4.62199 9.91034L4.78521 9.23105C4.98518 8.39877 4.63543 7.58765 4.00112 7.13409C4.00445 7.2737 4.02258 7.41562 4.05683 7.55816L4.62199 9.91034Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.46348 3C9.46348 4.10457 8.56805 5 7.46348 5C6.35891 5 5.46348 4.10457 5.46348 3C5.46348 1.89543 6.35891 1 7.46348 1C8.56805 1 9.46348 1.89543 9.46348 3ZM9.52339 5.18101C10.1023 4.63409 10.4635 3.85923 10.4635 3C10.4635 1.34315 9.12033 0 7.46348 0C5.80662 0 4.46348 1.34315 4.46348 3C4.46348 3.85922 4.8247 4.63408 5.40356 5.181C4.4317 5.4836 3.80296 6.50391 4.05627 7.55816L5.68205 14.3245C5.79005 14.774 6.19208 15.0909 6.65437 15.0909H8.27254C8.73483 15.0909 9.13686 14.774 9.24487 14.3245L10.8706 7.55816C11.1239 6.50392 10.4952 5.48363 9.52339 5.18101ZM6.00092 6.09091H8.92599C9.57278 6.09091 10.0494 6.69564 9.89832 7.32453L8.27254 14.0909H6.65437L5.0286 7.32453C4.87749 6.69564 5.35414 6.09091 6.00092 6.09091Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_4777_147920">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const AreaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 15 15"
    fill="none"
  >
    <path
      d="M14.6012 12.1833C15.0887 12.6708 15.0887 13.4833 14.6012 13.9708L13.7346 14.8375C13.6262 14.9458 13.5179 15 13.3554 15C13.2471 15 13.0846 14.9458 12.9762 14.8375C12.7596 14.6208 12.7596 14.2958 12.9762 14.1333L13.4637 13.6458H3.33874C2.20124 13.6458 1.33457 12.725 1.33457 11.5875V1.4625L0.847072 1.95C0.630406 2.16667 0.305406 2.16667 0.142906 1.95C-0.0195943 1.73333 -0.073761 1.40833 0.142906 1.24583L1.00957 0.379167C1.49707 -0.108333 2.30957 -0.108333 2.79707 0.379167L3.66374 1.24583C3.88041 1.4625 3.88041 1.7875 3.66374 1.95C3.55541 2.05833 3.39291 2.05833 3.28457 2.05833C3.17624 2.05833 3.01374 2.00417 2.90541 1.89583L2.36374 1.35417V11.5875C2.36374 12.1292 2.79707 12.6167 3.39291 12.6167H13.5721L13.0304 12.075C12.8137 11.8583 12.8137 11.5333 13.0304 11.3708C13.2471 11.1542 13.5721 11.1542 13.7346 11.3708L14.6012 12.1833ZM13.4637 0H6.85541C6.58457 0 6.36791 0.216667 6.36791 0.4875C6.36791 0.758333 6.58457 0.975 6.85541 0.975H13.4096C13.6804 0.975 13.8971 1.19167 13.8971 1.4625V8.125C13.8971 8.39583 14.1137 8.6125 14.3846 8.6125C14.6554 8.6125 14.8721 8.39583 14.8721 8.125V1.51667C14.9804 0.704167 14.2762 0 13.4637 0ZM8.45541 9.72083C8.72624 9.72083 8.94291 9.50417 8.94291 9.23333V6.95833C8.94291 6.2 8.29291 5.55 7.53457 5.55C7.20957 5.55 6.88457 5.65833 6.66791 5.875C6.45124 5.65833 6.12624 5.55 5.80124 5.55C5.58457 5.55 5.42207 5.60417 5.25957 5.65833C5.15124 5.55 5.04291 5.49583 4.88041 5.49583C4.60957 5.49583 4.39291 5.7125 4.39291 5.98333V9.17917C4.39291 9.45 4.60957 9.66667 4.88041 9.66667C5.15124 9.66667 5.36791 9.45 5.36791 9.17917V6.95833C5.36791 6.74167 5.53041 6.57917 5.74707 6.57917C5.96374 6.57917 6.12624 6.74167 6.12624 6.95833V9.23333C6.12624 9.50417 6.34291 9.72083 6.61374 9.72083C6.88457 9.72083 7.10124 9.50417 7.10124 9.23333V6.95833C7.10124 6.74167 7.26374 6.57917 7.48041 6.57917C7.69707 6.57917 7.85957 6.74167 7.85957 6.95833V9.23333C7.91374 9.50417 8.18457 9.72083 8.45541 9.72083ZM10.7304 3.7625C10.0804 3.7625 9.53874 4.30417 9.53874 4.95417C9.53874 5.225 9.75541 5.44167 10.0262 5.44167C10.2971 5.44167 10.5137 5.225 10.5137 4.95417C10.5137 4.84583 10.5679 4.79167 10.6762 4.79167C10.7304 4.79167 10.8387 4.84583 10.8387 4.95417C10.8387 5.00833 10.7304 5.225 10.2429 5.76667C9.9179 6.09167 9.64707 6.3625 9.64707 6.3625C9.48457 6.525 9.4304 6.74167 9.53874 6.90417C9.59291 7.12083 9.80957 7.22917 10.0262 7.22917H11.3804C11.6512 7.22917 11.8679 7.0125 11.8679 6.74167C11.8679 6.47083 11.6512 6.25417 11.3804 6.25417H11.2721C11.7054 5.7125 11.9221 5.33333 11.9221 5.00833C11.9221 4.25 11.3804 3.7625 10.7304 3.7625Z"
      fill="black"
    />
  </svg>
);

const BuildingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 15 15"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.5938 15C14.112 15 14.5312 14.5807 14.5312 14.0625V7.5C14.5312 6.9818 14.112 6.5625 13.5938 6.5625H12.6562V0.9375C12.6562 0.419297 12.237 0 11.7188 0H5.15625C4.63805 0 4.21875 0.419297 4.21875 0.9375V2.8125H1.40625C0.888047 2.8125 0.46875 3.2318 0.46875 3.75V14.0625C0.46875 14.5807 0.888047 15 1.40625 15H13.5938ZM1.40625 3.75H4.21875V5.5H3.5C3.22386 5.5 3 5.72386 3 6C3 6.27614 3.22386 6.5 3.5 6.5H4.21875V8H3.5C3.22386 8 3 8.22386 3 8.5C3 8.77614 3.22386 9 3.5 9H4.21875V10.5H3.5C3.22386 10.5 3 10.7239 3 11C3 11.2761 3.22386 11.5 3.5 11.5H4.21875V14.0625H1.40625V3.75ZM5.15625 0.9375H11.7188V14.0625H8.90625V11.25H7.96875V14.0625H5.15625V0.9375ZM12.6562 7.5H13.5938V14.0625H12.6562V7.5ZM6 9.5C6 9.22386 6.22386 9 6.5 9H10.5C10.7761 9 11 9.22386 11 9.5C11 9.77614 10.7761 10 10.5 10H6.5C6.22386 10 6 9.77614 6 9.5ZM6.5 3C6.22386 3 6 3.22386 6 3.5C6 3.77614 6.22386 4 6.5 4H10.5C10.7761 4 11 3.77614 11 3.5C11 3.22386 10.7761 3 10.5 3H6.5ZM6 7.5C6 7.22386 6.22386 7 6.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H6.5C6.22386 8 6 7.77614 6 7.5ZM6.5 5C6.22386 5 6 5.22386 6 5.5C6 5.77614 6.22386 6 6.5 6H10.5C10.7761 6 11 5.77614 11 5.5C11 5.22386 10.7761 5 10.5 5H6.5Z"
      fill="black"
    />
  </svg>
);

const PopulatedAreaIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.4949 0.505013C14.7683 0.77838 14.7683 1.2216 14.4949 1.49496L1.49493 14.495C1.22156 14.7683 0.778343 14.7683 0.504977 14.495C0.23161 14.2216 0.23161 13.7784 0.504977 13.505L13.505 0.505013C13.7783 0.231646 14.2216 0.231646 14.4949 0.505013ZM14.495 6.50503C14.7683 6.77839 14.7683 7.22161 14.495 7.49497L7.49497 14.495C7.22161 14.7683 6.77839 14.7683 6.50503 14.495C6.23166 14.2216 6.23166 13.7784 6.50503 13.505L13.505 6.50503C13.7784 6.23166 14.2216 6.23166 14.495 6.50503ZM8.49498 1.49497C8.76834 1.22161 8.76834 0.778392 8.49498 0.505025C8.22161 0.231658 7.77839 0.231658 7.50503 0.505025L0.505025 7.50503C0.231658 7.77839 0.231658 8.22161 0.505025 8.49498C0.778392 8.76834 1.22161 8.76834 1.49497 8.49498L8.49498 1.49497ZM3.49497 0.505025C3.76834 0.778392 3.76834 1.22161 3.49497 1.49497L1.49497 3.49497C1.22161 3.76834 0.778392 3.76834 0.505025 3.49497C0.231658 3.22161 0.231658 2.77839 0.505025 2.50503L2.50503 0.505025C2.77839 0.231658 3.22161 0.231658 3.49497 0.505025ZM14.495 12.495C14.7684 12.2216 14.7684 11.7784 14.495 11.505C14.2217 11.2317 13.7784 11.2317 13.5051 11.505L11.5051 13.505C11.2317 13.7784 11.2317 14.2216 11.5051 14.495C11.7784 14.7683 12.2217 14.7683 12.495 14.495L14.495 12.495Z"
      fill="black"
    />
  </svg>
);

const OneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 15 15"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.60002 4C8.60002 3.75732 8.45384 3.53854 8.22963 3.44567C8.00543 3.3528 7.74736 3.40413 7.57576 3.57573L5.57576 5.57573C5.34145 5.81005 5.34145 6.18995 5.57576 6.42426C5.81007 6.65857 6.18997 6.65857 6.42429 6.42426L7.40002 5.44852V10.4H6.50002C6.16865 10.4 5.90002 10.6686 5.90002 11C5.90002 11.3314 6.16865 11.6 6.50002 11.6H9.50002C9.8314 11.6 10.1 11.3314 10.1 11C10.1 10.6686 9.8314 10.4 9.50002 10.4H8.60002V4Z"
      fill="black"
    />
  </svg>
);

const TotalRoadsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 15 15"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.31257 14.9513C2.38285 14.9835 2.45927 15.0001 2.53658 15C2.66433 14.9997 2.78777 14.9537 2.88462 14.8704C2.98148 14.7871 3.04538 14.672 3.0648 14.5457L5.20765 0.617136C5.22508 0.478692 5.1878 0.338912 5.10375 0.227531C5.0197 0.116151 4.89551 0.0419601 4.75759 0.0207426C4.61968 -0.00047491 4.47893 0.0329551 4.36529 0.113921C4.25164 0.194887 4.17407 0.316999 4.14908 0.454279L2.00622 14.3828C1.99447 14.4593 1.9994 14.5373 2.02067 14.6116C2.04193 14.686 2.07903 14.7548 2.12942 14.8134C2.17981 14.8721 2.24229 14.9191 2.31257 14.9513ZM12.9007 14.8704C12.9975 14.9537 13.121 14.9997 13.2487 15C13.326 15.0001 13.4025 14.9835 13.4727 14.9513C13.543 14.9191 13.6055 14.8721 13.6559 14.8134C13.7063 14.7548 13.7434 14.686 13.7646 14.6116C13.7859 14.5373 13.7908 14.4593 13.7791 14.3828L11.6362 0.454279C11.6112 0.316999 11.5337 0.194887 11.42 0.113921C11.3064 0.0329551 11.1656 -0.00047491 11.0277 0.0207426C10.8898 0.0419601 10.7656 0.116151 10.6816 0.227531C10.5975 0.338912 10.5602 0.478692 10.5777 0.617136L12.7205 14.5457C12.7399 14.672 12.8038 14.7871 12.9007 14.8704ZM8.5 10.5C8.5 10.2239 8.27614 10 8 10C7.72386 10 7.5 10.2239 7.5 10.5V14.5C7.5 14.7761 7.72386 15 8 15C8.27614 15 8.5 14.7761 8.5 14.5V10.5ZM8 4C8.27614 4 8.5 4.22386 8.5 4.5V7.5C8.5 7.77614 8.27614 8 8 8C7.72386 8 7.5 7.77614 7.5 7.5V4.5C7.5 4.22386 7.72386 4 8 4ZM8.5 1C8.5 0.723858 8.27614 0.5 8 0.5C7.72386 0.5 7.5 0.723858 7.5 1V2C7.5 2.27614 7.72386 2.5 8 2.5C8.27614 2.5 8.5 2.27614 8.5 2V1Z"
      fill="black"
    />
  </svg>
);

const iconMapper = {
  population: <PopulationIcon />,
  area_km2: <AreaIcon />,
  total_building_count: <BuildingsIcon />,
  populated_area_km2: <PopulatedAreaIcon />,
  one: <OneIcon />,
};

const tooltipTextMapper = {
  population: i18n.t('bivariate.matrix.icon.population'),
  area_km2: i18n.t('bivariate.matrix.icon.area_km2'),
  total_building_count: i18n.t('bivariate.matrix.icon.total_building_count'),
  populated_area_km2: i18n.t('bivariate.matrix.icon.populated_area_km2'),
  one: i18n.t('bivariate.matrix.icon.one'),
};

const DenominatorIcon = ({ iconId }: DenominatorIconProps) => {
  const icon = iconMapper[iconId] || <TotalRoadsIcon />;
  const tooltipText =
    tooltipTextMapper[iconId] || i18n.t('bivariate.matrix.icon.roads');

  return (
    <TooltipWrapper tooltipText={tooltipText}>
      {({ showTooltip, hideTooltip }) => (
        <span
          className={styles.denominatorIcon}
          onPointerOver={showTooltip}
          onPointerLeave={hideTooltip}
        >
          {icon}
        </span>
      )}
    </TooltipWrapper>
  );
};

export default DenominatorIcon;
