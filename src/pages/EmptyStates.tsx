import { useState, useRef, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import lottie from "lottie-web";
import checkmarkLottie from "../assets/checkmark-animation.json";
import {
  Button,
  ButtonType,
  ButtonSize,
  IconButton,
  IconButtonType,
  IconButtonSize,
  IconType,
  IconColor,
  Text,
  TextStyle,
  TextColor,
  Spacing,
  Theme,
} from "@doordash/prism-react";

// ============================================================================
// LAYOUT (matching OrdersHome)
// ============================================================================

const DeviceFrame = styled.div`
  position: relative;
  width: 740px;
  min-height: 440px;
  background: #fff;
  border-radius: ${Theme.usage.borderRadius.large};
  overflow: hidden;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  display: flex;
  flex-direction: column;

  * {
    font-family: inherit !important;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px;
  font-size: 12px;
  color: #000;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: ${Spacing.medium};
  position: relative;
`;

const TabBarWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const TabBar = styled.div`
  display: flex;
  align-items: center;
  border-radius: 9999px;
`;

const TabItem = styled.button<{ $isActive: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 9999px;
  font-size: 16px;
  font-weight: 600;
  color: ${(p) => (p.$isActive ? "#181818" : "#6c6c6c")};
  background: ${(p) => (p.$isActive ? "#e9e9e9" : "transparent")};
  white-space: nowrap;
`;

const MenuBtn = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const StatusDot = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #006a25;
  border: 3px solid #fff;
`;

const PlaceholderLine = styled.div<{ $width?: string; $height?: string }>`
  width: ${(p) => p.$width || "100%"};
  height: ${(p) => p.$height || "14px"};
  background: #f1f1f1;
  border-radius: 6px;
`;

// ============================================================================
// EMPTY STATE
// ============================================================================

const EmptyStateArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding-bottom: 24px;
`;

const EmptyTitle = styled.p`
  font-family: "DD-TTNorms", -apple-system, BlinkMacSystemFont, sans-serif !important;
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
  color: ${TextColor.text.subdued.default};
  text-align: center;
  margin: 12px 0 0;
`;

const Subtitle = styled.p`
  font-family: "DD-TTNorms", -apple-system, BlinkMacSystemFont, sans-serif !important;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: ${TextColor.text.subdued.default};
  text-align: center;
  margin: 0;
`;

// ============================================================================
// STATE DROPDOWN
// ============================================================================

const DropdownRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${Spacing.medium};
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${Spacing.xSmall};
  padding: 6px ${Spacing.small};
  border-radius: ${Theme.usage.borderRadius.medium};
  border: 1px solid ${IconColor.border.default};
  box-sizing: border-box;

  &:hover {
    background-color: ${IconColor.background.hovered};
  }
`;

const DropdownChevron = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  transform: ${(p) => (p.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 150ms ease;
  font-size: 8px;
  color: #6c6c6c;
  margin-left: 2px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid ${IconColor.border.default};
  border-radius: ${Theme.usage.borderRadius.medium};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
  min-width: 180px;
`;

const DropdownItem = styled.button<{ $isActive: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${Spacing.xSmall};
  width: 100%;
  padding: ${Spacing.xSmall} ${Spacing.small};
  box-sizing: border-box;
  background-color: ${(p) =>
    p.$isActive ? IconColor.background.hovered : "transparent"};

  &:hover {
    background-color: ${IconColor.background.hovered};
  }
`;

// ============================================================================
// CLOCK ILLUSTRATION (animated)
// ============================================================================

const CX = 64.7;
const CY = 63.5;

const tickMinute = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const tickHour = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const MinuteHand = styled.line`
  transform-origin: ${CX}px ${CY}px;
  animation: ${tickMinute} 240s steps(240) infinite;
`;

const HourHand = styled.line`
  transform-origin: ${CX}px ${CY}px;
  animation: ${tickHour} 2880s linear infinite;
`;

const ClockSvg = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 129.375 128.225"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_clock)">
      <path d="M73.4993 5.14697C26.0918 5.14697 11.3433 34.2438 6.01239 60.2868C0.681465 86.3184 20.3956 123.078 57.0842 123.078C93.7728 123.078 115.507 101.633 122.368 75.6015C129.229 49.5699 113.236 5.14697 73.4879 5.14697H73.4993Z" fill="#D2DEFF" />
      <path d="M57.0844 128.214C40.1442 128.214 24.8477 120.894 14.0261 107.592C2.71356 93.7069 -2.27491 75.1782 0.978438 59.2459C9.02619 19.9354 33.4206 0 73.4995 0C90.2571 0 104.595 7.13695 114.971 20.6331C126.9 36.1423 131.991 59.2916 127.345 76.9167C123.464 91.6481 115.428 104.172 104.104 113.139C91.6383 123.01 75.383 128.225 57.0958 128.225L57.0844 128.214ZM73.4995 10.2937C38.0209 10.2937 18.1698 26.5005 11.0467 61.3161C8.4326 74.1031 12.7247 89.7152 21.9825 101.095C30.8179 111.95 43.2833 117.931 57.0844 117.931C87.6544 117.931 110.211 101.622 117.403 74.2861C121.284 59.5433 116.935 40.0653 106.821 26.9123C100.987 19.3293 90.474 10.2937 73.4881 10.2937H73.4995Z" fill="#9777C9" />
      <HourHand x1={CX} y1={CY} x2={CX - 18} y2={CY - 26} stroke="#404040" strokeWidth="5.5" strokeLinecap="round" />
      <MinuteHand x1={CX} y1={CY} x2={CX + 14} y2={CY - 38} stroke="#404040" strokeWidth="4" strokeLinecap="round" />
      <circle cx={CX} cy={CY} r="7" fill="#9777C9" />
    </g>
    <defs>
      <clipPath id="clip0_clock">
        <rect width="129.375" height="128.225" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// ============================================================================
// BURGER ILLUSTRATION (animated assembly)
// ============================================================================

const hoverUp = keyframes`
  0%, 10%   { transform: translateY(0); }
  30%       { transform: translateY(-6px); }
  50%       { transform: translateY(0); }
  100%      { transform: translateY(0); }
`;

const hoverDown = keyframes`
  0%, 10%   { transform: translateY(0); }
  30%       { transform: translateY(6px); }
  50%       { transform: translateY(0); }
  100%      { transform: translateY(0); }
`;

const BurgerTopBun = styled.g`
  animation: ${hoverUp} 6s ease-in-out infinite;
`;

const BurgerBottomBun = styled.g`
  animation: ${hoverDown} 6s ease-in-out infinite;
`;

const BurgerSvg = () => (
  <svg
    width="110"
    height="91"
    viewBox="-10 -10 300 252"
    overflow="visible"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      {/* Top bun + seeds + patty (single unit) */}
      <BurgerTopBun>
        <path d="M38.5004 79.9454C38.5004 79.9454 36.1306 71.0487 41.1205 54.1775C45.2509 40.197 56.5407 17.8515 96.2844 6.388C134.885 -4.75152 182.789 0.0332397 210.467 10.4085C238.145 20.7838 249.018 39.6487 251.588 54.2688C254.158 68.8889 252.689 77.661 252.689 77.661L38.4921 79.9454H38.5004Z" fill="#FF8A00" />
        <path d="M88.7496 24.2976C83.9266 24.713 78.144 26.7648 78.5612 31.0179C78.9784 35.271 85.1699 34.9969 88.616 34.8557C92.0622 34.7144 98.5457 32.9285 98.8044 29.9214C99.0631 26.9143 95.2164 23.7494 88.7496 24.2976Z" fill="#FDBC43" />
        <path d="M125.79 7.85C121.81 8.18227 115.46 10.4584 115.877 14.2961C116.294 18.1339 121.109 19.2304 126.758 18.6822C132.407 18.1339 137.772 16.0738 136.671 12.5102C135.569 8.94651 130.746 7.43465 125.79 7.85Z" fill="#FDBC43" />
        <path d="M144.514 31.832C139.691 31.832 133.224 34.7144 133.909 38.9593C134.593 43.2041 141.343 43.2124 145.198 42.797C149.054 42.3817 154.703 40.4628 154.703 37.1733C154.703 33.5182 149.746 31.8236 144.514 31.8236V31.832Z" fill="#FDBC43" />
        <path d="M175.63 10.8654C170.807 11.5549 165.992 14.022 166.677 17.5857C167.403 21.357 173.978 21.6976 178.242 21.2905C182.506 20.8835 188.021 18.5493 187.195 14.7115C186.636 12.1114 181.663 10.0181 175.63 10.8737V10.8654Z" fill="#FDBC43" />
        <path d="M211.569 29.7802C205.511 30.0543 201.239 32.9368 201.931 36.3592C202.624 39.7816 208.957 40.7452 214.464 40.197C218.595 39.7816 222.45 37.7298 222.174 34.4403C221.949 31.7073 217.902 29.4894 211.569 29.7802Z" fill="#FDBC43" />
        <path d="M142.178 54.6343C117.946 54.8669 62.874 57.5584 45.9769 70.3509C34.3366 79.1645 36.1557 87.3136 51.4841 93.7431C65.4357 99.5911 110.228 109.069 146.951 108.363C183.674 107.657 221.115 103.612 238.379 93.3776C255.643 83.1435 258.806 73.2251 239.847 66.6959C219.771 59.7763 179.635 54.2688 142.178 54.6343Z" fill="#BB6500" />
      </BurgerTopBun>
      {/* Bottom bun */}
      <BurgerBottomBun>
        <path d="M53.228 176.995C49.373 176.995 44.6919 176.172 40.4196 183.3C36.4978 189.845 35.872 203.311 43.8658 211.26C51.8596 219.21 62.4401 224.817 91.3697 228.53C118.08 231.961 129.787 231.82 144.381 231.82C158.975 231.82 192.844 231.272 207.989 227.982C223.134 224.693 241.032 219.758 247.916 209.89C254.325 200.702 255.752 189.488 249.293 182.477C244.746 177.543 240.34 177.817 231.67 177.817C224.511 177.817 53.228 176.995 53.228 176.995Z" fill="#FF8A00" />
      </BurgerBottomBun>
      {/* Left cloud */}
      <g>
        <path d="M37.399 94.1335C38.417 92.1482 44.4916 77.1127 63.2411 77.1127C80.4971 77.1127 87.4395 87.7372 88.7579 89.5398C90.6187 92.0734 92.1373 92.6383 95.2998 91.251C100.465 88.9916 106.656 87.8951 113.407 91.7328C118.756 94.7732 119.256 97.1489 120.708 101.419C121.709 104.376 122.268 104.667 128.418 105.622C135.644 106.743 146.091 112.841 145.357 130.385C144.623 147.929 128.785 156.934 115.201 158.213C102.576 159.401 97.6445 156.493 94.9577 155.538C91.862 154.441 90.5936 154.965 88.7579 156.975C86.9222 158.985 80.4387 166.893 66.729 168.123C49.7735 169.643 40.7116 158.952 36.9901 154.965C33.8944 151.65 33.4855 150.587 28.9129 151.127C22.3292 151.908 10.5221 149.383 4.31398 139.979C-1.89415 130.576 -1.54369 116.878 6.14972 108.247C14.8945 98.4448 24.2317 98.4946 30.6568 98.2371C36.3977 98.0045 35.6801 97.4812 37.4073 94.1252L37.399 94.1335Z" fill="#D2DEFF" />
      </g>
      {/* Right cloud */}
      <g>
        <path d="M235.525 110.373C229.05 110.581 224.444 111.952 219.688 118.938C217.652 121.937 216.792 121.679 214.731 121.679C212.67 121.679 203.508 120.034 195.94 127.776C189.356 134.513 191.275 146.409 198.485 150.122C204.61 153.278 207.088 152.655 210.117 152.456C212.729 152.282 213.288 154.242 214.798 156.568C216.6 159.343 221.974 164.933 232.905 164.792C243.836 164.651 246.464 160.888 247.916 158.761C249.076 157.058 249.71 156.427 252.597 157.249C255.485 158.072 265.197 158.636 271.739 153.27C278.281 147.904 282.203 139.497 278.765 130.376C275.077 120.608 265.406 119.685 260.725 120.782C256.653 121.737 256.177 120.923 255.076 119.411C253.974 117.9 249.977 109.908 235.525 110.365V110.373Z" fill="#D2DEFF" />
      </g>
    </g>
  </svg>
);

// ============================================================================
// CHECKMARK ILLUSTRATION (scale-in bounce + pulse)
// ============================================================================

const circleAnim = keyframes`
  0%        { transform: scale(1); opacity: 0; }
  0.5%      { transform: scale(0); opacity: 0; }
  2.5%      { transform: scale(1.16); opacity: 1; }
  4%        { transform: scale(0.96); opacity: 1; }
  5%        { transform: scale(1); opacity: 1; }
  99%       { transform: scale(1); opacity: 1; }
  100%      { transform: scale(1); opacity: 0; }
`;

const checkAnim = keyframes`
  0%        { transform: scale(1); opacity: 0; }
  0.5%      { transform: scale(0); opacity: 0; }
  1.5%      { transform: scale(0); opacity: 0; }
  3.5%      { transform: scale(1.16); opacity: 1; }
  5%        { transform: scale(0.96); opacity: 1; }
  6%        { transform: scale(1); opacity: 1; }
  99%       { transform: scale(1); opacity: 1; }
  100%      { transform: scale(1); opacity: 0; }
`;

const CheckCircle = styled.path`
  transform-origin: 112.7px 113.5px;
  will-change: transform;
  animation: ${circleAnim} 10s linear infinite;
`;

const CheckMark = styled.path`
  transform-origin: 117.2px 110.9px;
  will-change: transform;
  animation: ${checkAnim} 10s linear infinite;
`;

const CheckmarkSvg = () => (
  <svg
    width="100"
    height="100"
    viewBox="-15 -15 255 257"
    overflow="visible"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <CheckCircle d="M225.35 112.37C222.67 171.9 167.14 229.19 95.74 226.89C33.74 224.89 -2.58 174.7 0.14 115.17C3.02 52.33 59.04 0 121.07 0C183.1 0 228.18 49.52 225.34 112.37H225.35Z" fill="#A7D87C" />
    <CheckMark d="M71.82 103.49L56.33 124.89L105.02 160.3L178.07 76.93L157.41 61.43L101.33 126.36L71.82 103.49Z" fill="#00AB42" />
  </svg>
);

// ============================================================================
// DATA
// ============================================================================

type EmptyStateType = "store-closed" | "no-orders" | "needs-action";

interface EmptyStateConfig {
  id: EmptyStateType;
  label: string;
  illustration: () => JSX.Element;
  title: string;
  subtitle: string;
}

const emptyStates: EmptyStateConfig[] = [
  {
    id: "needs-action",
    label: "Needs action",
    illustration: CheckmarkSvg,
    title: "You\u2019re all caught up",
    subtitle: "",
  },
  {
    id: "store-closed",
    label: "Store closed",
    illustration: ClockSvg,
    title: "Your store is closed",
    subtitle: "Opens at 11:00 AM",
  },
  {
    id: "no-orders",
    label: "No orders",
    illustration: BurgerSvg,
    title: "No orders yet",
    subtitle: "",
  },
];

const tabs = [
  { width: "52px", active: true },
  { width: "108px", active: false },
  { width: "92px", active: false },
  { width: "68px", active: false },
];

// ============================================================================
// MAIN EXPORT
// ============================================================================

export function EmptyStatesDemo() {
  const [activeState, setActiveState] = useState<EmptyStateType>("needs-action");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = emptyStates.find((s) => s.id === activeState)!;
  const Illustration = current.illustration;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <DropdownRow>
        <DropdownWrapper ref={dropdownRef}>
          <DropdownButton onClick={() => setDropdownOpen(!dropdownOpen)}>
            <Text textStyle={TextStyle.label.small.strong}>{current.label}</Text>
            <DropdownChevron $isOpen={dropdownOpen}>▼</DropdownChevron>
          </DropdownButton>
          {dropdownOpen && (
            <DropdownMenu>
              {emptyStates.map((state) => (
                <DropdownItem
                  key={state.id}
                  $isActive={activeState === state.id}
                  onClick={() => {
                    setActiveState(state.id);
                    setDropdownOpen(false);
                  }}
                >
                  <Text textStyle={TextStyle.label.small.default}>
                    {state.label}
                  </Text>
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </DropdownWrapper>
      </DropdownRow>

      <DeviceFrame>
        <TopBar>
          <span>11:30 AM</span>
        </TopBar>

        <PageHeader>
          <MenuBtn>
            <IconButton
              iconType={IconType.Menu}
              size={IconButtonSize.large}
              type={IconButtonType.tertiary}
              accessibilityLabel="Menu"
            />
            <StatusDot />
          </MenuBtn>

          <TabBarWrapper>
            <TabBar>
              {tabs.map((tab, i) => (
                <TabItem key={i} $isActive={tab.active}>
                  <PlaceholderLine
                    $width={tab.width}
                    $height="14px"
                    style={{ background: tab.active ? "#bbb" : "#e0e0e0" }}
                  />
                </TabItem>
              ))}
            </TabBar>
          </TabBarWrapper>
        </PageHeader>

        <EmptyStateArea>
          <Illustration />
          <EmptyTitle>{current.title}</EmptyTitle>
          {current.subtitle && <Subtitle>{current.subtitle}</Subtitle>}
        </EmptyStateArea>
      </DeviceFrame>

      {activeState === "needs-action" && (
        <LottiePreview animationData={checkmarkLottie} filename="checkmark-animation.json" />
      )}
    </div>
  );
}

// ============================================================================
// LOTTIE PREVIEW
// ============================================================================

const LottieCard = styled.div`
  margin-top: 24px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
`;

const LottieHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LottieActions = styled.div`
  display: flex;
  gap: 8px;
`;

const LottieContainer = styled.div`
  width: 160px;
  height: 160px;
  margin: 16px auto;
`;

function LottiePreview({
  animationData,
  filename,
}: {
  animationData: unknown;
  filename: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<ReturnType<typeof lottie.loadAnimation> | null>(null);

  const loadAnim = useCallback(() => {
    if (!containerRef.current) return;
    if (animRef.current) animRef.current.destroy();
    containerRef.current.innerHTML = "";
    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: animationData as Record<string, unknown>,
    });
  }, [animationData]);

  useEffect(() => {
    loadAnim();
    return () => {
      if (animRef.current) animRef.current.destroy();
    };
  }, [loadAnim]);

  const handlePlayAgain = () => {
    if (animRef.current) {
      animRef.current.goToAndPlay(0);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(animationData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <LottieCard>
      <LottieHeader>
        <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>
          LOTTIE PREVIEW
        </Text>
        <LottieActions>
          <Button
            type={ButtonType.tertiary}
            size={ButtonSize.small}
            onClick={handlePlayAgain}
          >
            Play again
          </Button>
          <Button
            type={ButtonType.tertiary}
            size={ButtonSize.small}
            onClick={handleDownload}
          >
            Download .json
          </Button>
        </LottieActions>
      </LottieHeader>
      <LottieContainer ref={containerRef} />
    </LottieCard>
  );
}
