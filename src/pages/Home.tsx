import { useState, useRef, useCallback, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import {
  Button,
  ButtonType,
  ButtonSize,
  IconColor,
  Spacing,
  StackChildren,
  Text,
  TextStyle,
  TextColor,
  Theme,
  Theming,
  MerchantThemeCollection,
  WoltMerchantThemeCollection,
  DeliverooMerchantThemeCollection,
} from "@doordash/prism-react";
import { OrdersHomeDemo } from "./OrdersHome";
import { SubtleAlertsDemo } from "./SubtleAlerts";
import { FullScreenAlertsDemo } from "./FullScreenAlerts";

// ============================================================================
// LAYOUT
// ============================================================================

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #fff;
`;

const Sidebar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  border-right: 1px solid ${IconColor.border.default};
  display: flex;
  flex-direction: column;
  background-color: #fff;
  z-index: 5;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  padding: ${Spacing.large};
  border-bottom: 1px solid ${IconColor.border.default};
`;

const SidebarBody = styled.div`
  padding: ${Spacing.medium} ${Spacing.small};
  display: flex;
  flex-direction: column;
  gap: ${Spacing.xxSmall};
`;

const SidebarSectionLabel = styled.div`
  padding: ${Spacing.xSmall} ${Spacing.small};
`;

const SidebarItem = styled.button<{ $isActive: boolean }>`
  all: unset;
  cursor: pointer;
  padding: ${Spacing.small} ${Spacing.medium};
  border-radius: ${Theme.usage.borderRadius.medium};
  border: ${(props) =>
    props.$isActive ? `1px solid ${IconColor.border.default}` : "1px solid transparent"};
  background-color: ${(props) =>
    props.$isActive ? IconColor.background.default : "transparent"};

  &:hover {
    background-color: ${IconColor.background.hovered};
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: ${Spacing.xLarge} 48px;
  min-width: 0;
`;

// ============================================================================
// DEMO AREA
// ============================================================================

const DemoArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
  border: 1px solid ${IconColor.border.default};
  border-radius: ${Theme.usage.borderRadius.large};
  padding: ${Spacing.xLarge};
  overflow-x: auto;
`;

const DemoContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const InstructionHint = styled.div`
  padding-top: ${Spacing.medium};
`;

// ============================================================================
// SPECS
// ============================================================================

const SpecsToggle = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${Spacing.xSmall};
`;

const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  transform: ${(props) => (props.$isOpen ? "rotate(0deg)" : "rotate(-90deg)")};
  transition: transform 150ms ease;
  font-size: 12px;
`;

const SpecCard = styled.div`
  border: 1px solid ${IconColor.border.default};
  border-radius: ${Theme.usage.borderRadius.medium};
  overflow: hidden;
`;

const SpecCardHeader = styled.div`
  padding: ${Spacing.small} ${Spacing.medium};
  background-color: ${IconColor.background.hovered};
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${Spacing.small} ${Spacing.medium};
  border-top: 1px solid ${IconColor.border.default};
`;

const SpecValue = styled.span`
  font-family: "SF Mono", "Menlo", "Monaco", monospace;
  font-size: 13px;
  color: ${TextColor.text.default};
`;

// ============================================================================
// THEME SWITCHER
// ============================================================================

const DoorDashLogo = () => (
  <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="22" fill="#FF3008" />
    <path d="M72.5 38.2H32.8C30 38.2 27.6 40.3 27.3 43.1C26.4 51 29.1 59.3 34.9 65.1C40.7 70.9 49 73.6 56.9 72.7C59.7 72.4 61.8 70 61.8 67.2V51.3H72.5C78 51.3 82.5 46.8 82.5 41.3V48.2C82.5 42.7 78 38.2 72.5 38.2ZM72.5 46.8H66.3V41.3H72.5C73.7 41.3 74.7 42.3 74.7 43.5V44.6C74.7 45.8 73.7 46.8 72.5 46.8Z" fill="white" />
  </svg>
);

const WoltLogo = () => (
  <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="22" fill="#009DE0" />
    <path d="M25 65L35 35H42L47 55L52 35H59L64 55L69 35H76L66 65H59L54 45L49 65H42L25 65Z" fill="white" />
  </svg>
);

const DeliverooLogo = () => (
  <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="22" fill="#00CCBC" />
    <path d="M50 28C38.95 28 30 36.95 30 48C30 59.05 38.95 68 50 68C55.1 68 59.7 66.1 63.2 63L57.8 57.6C55.7 59.3 53 60.3 50 60.3C43.2 60.3 37.7 54.8 37.7 48C37.7 41.2 43.2 35.7 50 35.7C53 35.7 55.7 36.7 57.8 38.4L63.2 33C59.7 29.9 55.1 28 50 28Z" fill="white" />
  </svg>
);

interface ThemeOption {
  id: string;
  label: string;
  collection: typeof MerchantThemeCollection;
  logo: () => JSX.Element;
}

const themeOptions: ThemeOption[] = [
  { id: "doordash", label: "DoorDash", collection: MerchantThemeCollection, logo: DoorDashLogo },
  { id: "wolt", label: "Wolt", collection: WoltMerchantThemeCollection, logo: WoltLogo },
  { id: "deliveroo", label: "Deliveroo", collection: DeliverooMerchantThemeCollection, logo: DeliverooLogo },
];

const SidebarFooter = styled.div`
  margin-top: auto;
  padding: ${Spacing.medium};
  border-top: 1px solid ${IconColor.border.default};
  position: sticky;
  bottom: 0;
  background-color: #fff;
`;

const ThemeDropdownWrapper = styled.div`
  position: relative;
`;

const ThemeDropdownButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${Spacing.small};
  width: 100%;
  padding: ${Spacing.small} ${Spacing.medium};
  border-radius: ${Theme.usage.borderRadius.medium};
  border: 1px solid ${IconColor.border.default};
  box-sizing: border-box;

  &:hover {
    background-color: ${IconColor.background.hovered};
  }
`;

const ThemeDropdownChevron = styled.span<{ $isOpen: boolean }>`
  margin-left: auto;
  display: inline-flex;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 150ms ease;
  font-size: 10px;
  color: ${TextColor.text.subdued.default};
`;

const ThemeDropdownMenu = styled.div`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${IconColor.border.default};
  border-radius: ${Theme.usage.borderRadius.medium};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
`;

const ThemeDropdownItem = styled.button<{ $isActive: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${Spacing.small};
  width: 100%;
  padding: ${Spacing.small} ${Spacing.medium};
  box-sizing: border-box;
  background-color: ${(props) => (props.$isActive ? IconColor.background.hovered : "transparent")};

  &:hover {
    background-color: ${IconColor.background.hovered};
  }
`;

const ThemeLabel = styled.div`
  padding-bottom: ${Spacing.xSmall};
`;

// ============================================================================
// DATA
// ============================================================================

interface SpecItem {
  label: string;
  value: string;
}

interface SpecGroup {
  title: string;
  specs: SpecItem[];
}

interface Demo {
  id: string;
  label: string;
  description: string;
  instruction: string;
  specs: SpecGroup[];
}

const demos: Demo[] = [
  {
    id: "loader-button",
    label: "Loader button",
    description:
      'This loading button is used for actions like "Ready for pickup" and "Picked up by Dasher" to enable Mx to cancel the action if performed by mistake.',
    instruction: "Click to trigger, click again to cancel",
    specs: [
      {
        title: "Loading bar",
        specs: [
          { label: "Duration", value: "3000ms" },
          { label: "Easing", value: "Linear" },
          { label: "Direction", value: "Left → Right" },
        ],
      },
      {
        title: "Cancel — bar retract",
        specs: [
          { label: "Duration", value: "150ms" },
          { label: "Easing", value: "Ease in" },
        ],
      },
      {
        title: "Cancel — text shake",
        specs: [
          { label: "Duration", value: "500ms" },
          { label: "Easing", value: "Ease out" },
        ],
      },
    ],
  },
  {
    id: "orders-home",
    label: "Order details transitions",
    description:
      "Transitions for opening and closing the full-screen order details view.",
    instruction: "Tap a card to open, tap ✕ or scrim to close",
    specs: [
      {
        title: "Order detail — open",
        specs: [
          { label: "Duration", value: "250ms" },
          { label: "Easing", value: "cubic-bezier(0.2, 0, 0, 1)" },
          { label: "Scale", value: "0.92 → 1" },
          { label: "Opacity", value: "0 → 1" },
        ],
      },
      {
        title: "Scrim — fade in",
        specs: [
          { label: "Duration", value: "200ms" },
          { label: "Easing", value: "Ease out" },
          { label: "Opacity", value: "0 → 0.5" },
        ],
      },
      {
        title: "Card — close bounce",
        specs: [
          { label: "Duration", value: "450ms" },
          { label: "Easing", value: "Ease in-out" },
          { label: "Keyframes", value: "1 → 0.95 → 0.98 → 1" },
          { label: "Property", value: "Scale" },
        ],
      },
    ],
  },
  {
    id: "subtle-alerts",
    label: "Subtle alerts",
    description:
      "A non-blocking banner that slides in from the top to notify of new orders.",
    instruction: "",
    specs: [
      {
        title: "Alert — slide in",
        specs: [
          { label: "Duration", value: "350ms" },
          { label: "Easing", value: "cubic-bezier(0.2, 0, 0, 1)" },
          { label: "Transform", value: "translateY(-100%) → 0" },
          { label: "Opacity", value: "0 → 1" },
        ],
      },
      {
        title: "Alert — slide out",
        specs: [
          { label: "Duration", value: "250ms" },
          { label: "Easing", value: "Ease in" },
          { label: "Transform", value: "0 → translateY(-100%)" },
          { label: "Opacity", value: "1 → 0" },
        ],
      },
    ],
  },
  {
    id: "full-screen-alerts",
    label: "Full screen alerts",
    description:
      "A full-screen takeover alert for high-priority notifications like new orders.",
    instruction: "",
    specs: [
      {
        title: "Overlay — fade in",
        specs: [
          { label: "Duration", value: "300ms" },
          { label: "Easing", value: "Ease out" },
          { label: "Opacity", value: "0 → 1" },
        ],
      },
      {
        title: "Badge — scale in",
        specs: [
          { label: "Duration", value: "400ms" },
          { label: "Easing", value: "cubic-bezier(0.2, 0, 0, 1)" },
          { label: "Scale", value: "0.5 → 1" },
        ],
      },
      {
        title: "Badge — pulse + ripple",
        specs: [
          { label: "Duration", value: "1800ms" },
          { label: "Easing", value: "Ease in-out" },
          { label: "Loop", value: "Infinite" },
          { label: "Scale", value: "1 → 1.08 → 1" },
          { label: "Ring scale", value: "1 → 2.2" },
        ],
      },
      {
        title: "Text — slide up",
        specs: [
          { label: "Duration", value: "350ms" },
          { label: "Easing", value: "Ease out" },
          { label: "Delay (title)", value: "150ms" },
          { label: "Delay (subtitle)", value: "250ms" },
        ],
      },
      {
        title: "Overlay — fade out",
        specs: [
          { label: "Duration", value: "200ms" },
          { label: "Easing", value: "Ease in" },
          { label: "Opacity", value: "1 → 0" },
        ],
      },
    ],
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const Home = () => {
  const [activeDemo, setActiveDemo] = useState(demos[0].id);
  const [showSpecs, setShowSpecs] = useState(true);
  const [activeThemeId, setActiveThemeId] = useState("doordash");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentDemo = demos.find((d) => d.id === activeDemo)!;
  const currentTheme = themeOptions.find((t) => t.id === activeThemeId)!;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <PageContainer>
      <Sidebar>
        <SidebarHeader>
          <StackChildren size={Spacing.xxSmall}>
            <Text textStyle={TextStyle.title.medium}>ULOM Animation Demo</Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              Questions? @<a href="https://doordash.enterprise.slack.com/team/U073XBFAWUV" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>Oliver</a> on Slack
            </Text>
          </StackChildren>
        </SidebarHeader>

        <SidebarBody>
          <SidebarSectionLabel>
            <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>
              DEMOS
            </Text>
          </SidebarSectionLabel>
          {demos.map((demo) => (
            <SidebarItem
              key={demo.id}
              $isActive={activeDemo === demo.id}
              onClick={() => setActiveDemo(demo.id)}
            >
              <Text
                textStyle={
                  activeDemo === demo.id
                    ? TextStyle.label.medium.strong
                    : TextStyle.label.medium.default
                }
              >
                {demo.label}
              </Text>
            </SidebarItem>
          ))}
        </SidebarBody>

        <SidebarFooter>
          <ThemeLabel>
            <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>
              THEME
            </Text>
          </ThemeLabel>
          <ThemeDropdownWrapper ref={dropdownRef}>
            <ThemeDropdownButton onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}>
              <currentTheme.logo />
              <Text textStyle={TextStyle.label.medium.default}>{currentTheme.label}</Text>
              <ThemeDropdownChevron $isOpen={themeDropdownOpen}>▼</ThemeDropdownChevron>
            </ThemeDropdownButton>
            {themeDropdownOpen && (
              <ThemeDropdownMenu>
                {themeOptions.map((opt) => (
                  <ThemeDropdownItem
                    key={opt.id}
                    $isActive={activeThemeId === opt.id}
                    onClick={() => {
                      setActiveThemeId(opt.id);
                      setThemeDropdownOpen(false);
                    }}
                  >
                    <opt.logo />
                    <Text textStyle={TextStyle.label.medium.default}>{opt.label}</Text>
                  </ThemeDropdownItem>
                ))}
              </ThemeDropdownMenu>
            )}
          </ThemeDropdownWrapper>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <StackChildren size={Spacing.large}>
          <StackChildren size={Spacing.xSmall}>
            <Text textStyle={TextStyle.title.large}>{currentDemo.label}</Text>
            <Text textStyle={TextStyle.body.medium.default} color={TextColor.text.subdued.default}>
              {currentDemo.description}
            </Text>
          </StackChildren>

          <DemoArea>
            <Theming theme={currentTheme.collection}>
              <DemoContent>
                {activeDemo === "loader-button" && <LoaderButtonDemo />}
                {activeDemo === "orders-home" && <OrdersHomeDemo />}
                {activeDemo === "subtle-alerts" && <SubtleAlertsDemo />}
                {activeDemo === "full-screen-alerts" && <FullScreenAlertsDemo themeId={activeThemeId} />}
              </DemoContent>
            </Theming>
            <InstructionHint>
              <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
                {currentDemo.instruction}
              </Text>
            </InstructionHint>
          </DemoArea>

          <StackChildren size={Spacing.medium}>
            <SpecsToggle onClick={() => setShowSpecs(!showSpecs)}>
              <ChevronIcon $isOpen={showSpecs}>▼</ChevronIcon>
              <Text textStyle={TextStyle.body.medium.default}>
                {showSpecs ? "Hide specs" : "Show specs"}
              </Text>
            </SpecsToggle>

            {showSpecs && (
              <StackChildren size={Spacing.medium}>
                {currentDemo.specs.map((group) => (
                  <SpecCard key={group.title}>
                    <SpecCardHeader>
                      <Text textStyle={TextStyle.label.small.default}>
                        {group.title}
                      </Text>
                    </SpecCardHeader>
                    {group.specs.map((spec) => (
                      <SpecRow key={spec.label}>
                        <Text
                          textStyle={TextStyle.body.small.default}
                          color={TextColor.text.subdued.default}
                        >
                          {spec.label}
                        </Text>
                        <SpecValue>{spec.value}</SpecValue>
                      </SpecRow>
                    ))}
                  </SpecCard>
                ))}
              </StackChildren>
            )}
          </StackChildren>
        </StackChildren>
      </MainContent>
    </PageContainer>
  );
};

// ============================================================================
// LOADER BUTTON STYLES
// ============================================================================

const shakeKeyframes = keyframes`
  0%   { transform: translateX(0); }
  20%  { transform: translateX(-5px); }
  40%  { transform: translateX(5px); }
  60%  { transform: translateX(-3px); }
  100% { transform: translateX(0); }
`;

const LoaderBtnWrapper = styled.div<{ $isShaking: boolean }>`
  position: relative;
  display: inline-flex;
  width: 260px;
  border-radius: 9999px;
  overflow: hidden;
  cursor: pointer;

  & > button {
    width: 100%;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
    height: 64px !important;
    padding-left: 24px !important;
    padding-right: 24px !important;
    font-size: 18px !important;
  }

  & > button * {
    font-family: inherit !important;
  }

  & > button > * {
    position: relative;
    z-index: 2;
    animation: ${(props) =>
      props.$isShaking
        ? css`${shakeKeyframes} 500ms ease-out`
        : "none"};
  }
`;

const LoaderBarOuter = styled.div`
  position: absolute;
  inset: 0;
  transform-origin: left;
  pointer-events: none;
  z-index: 1;
`;

const LoaderBarInner = styled.div`
  width: 100%;
  height: 100%;
  background-color: #d9dada;
`;

// ============================================================================
// DEMO: Loader Button
// ============================================================================

type Phase = "idle" | "loading-init" | "loading" | "completing" | "cancelling" | "shaking";

function LoaderButtonDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const isCancellingRef = useRef(false);

  phaseRef.current = phase;

  useEffect(() => {
    if (phase === "loading-init") {
      let rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => {
          if (phaseRef.current === "loading-init") {
            setPhase("loading");
          }
        });
      });
      return () => cancelAnimationFrame(rafId);
    }

    if (phase === "loading") {
      const id = window.setTimeout(() => {
        if (phaseRef.current === "loading") {
          setPhase("completing");
        }
      }, 3000);
      return () => clearTimeout(id);
    }

    if (phase === "completing") {
      const id = setTimeout(() => {
        if (phaseRef.current === "completing") {
          setPhase("idle");
        }
      }, 400);
      return () => clearTimeout(id);
    }

    if (phase === "cancelling") {
      const id = setTimeout(() => {
        if (phaseRef.current === "cancelling") {
          setPhase("shaking");
        }
      }, 150);
      return () => clearTimeout(id);
    }

    if (phase === "shaking") {
      const id = setTimeout(() => {
        setPhase("idle");
        isCancellingRef.current = false;
      }, 500);
      return () => clearTimeout(id);
    }
  }, [phase]);

  const handleClick = useCallback(() => {
    if (phaseRef.current === "idle") {
      setPhase("loading-init");
    } else if (
      (phaseRef.current === "loading" || phaseRef.current === "loading-init") &&
      !isCancellingRef.current
    ) {
      isCancellingRef.current = true;
      setPhase("cancelling");
    }
  }, []);

  let barScale: number;
  let barTransition: string;
  let innerOpacity: number;
  let innerTransition: string;

  switch (phase) {
    case "loading":
      barScale = 1;
      barTransition = "transform 3000ms linear";
      innerOpacity = 1;
      innerTransition = "none";
      break;
    case "completing":
      barScale = 1;
      barTransition = "none";
      innerOpacity = 0;
      innerTransition = "opacity 400ms ease-out";
      break;
    case "cancelling":
      barScale = 0;
      barTransition = "transform 150ms ease-in";
      innerOpacity = 1;
      innerTransition = "none";
      break;
    default:
      barScale = 0;
      barTransition = "none";
      innerOpacity = 1;
      innerTransition = "none";
      break;
  }

  const isActive = phase === "loading-init" || phase === "loading";
  const text = isActive ? "Tap to cancel" : "Ready for pickup";

  return (
    <LoaderBtnWrapper $isShaking={phase === "shaking"} onClick={handleClick}>
      <LoaderBarOuter
        style={{ transform: `scaleX(${barScale})`, transition: barTransition }}
      >
        <LoaderBarInner
          style={{ opacity: innerOpacity, transition: innerTransition }}
        />
      </LoaderBarOuter>
      <Button type={ButtonType.tertiary} size={ButtonSize.large}>
        {text}
      </Button>
    </LoaderBtnWrapper>
  );
}
