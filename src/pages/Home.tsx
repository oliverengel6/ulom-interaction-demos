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
} from "@doordash/prism-react";
import { OrdersHomeDemo } from "./OrdersHome";

// ============================================================================
// LAYOUT
// ============================================================================

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #fff;
`;

const Sidebar = styled.nav`
  width: 260px;
  min-width: 260px;
  border-right: 1px solid ${IconColor.border.default};
  display: flex;
  flex-direction: column;
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
  padding: ${Spacing.xLarge} 48px;
  min-width: 0;
`;

// ============================================================================
// DEMO AREA
// ============================================================================

const DemoArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border: 1px solid ${IconColor.border.default};
  border-radius: ${Theme.usage.borderRadius.large};
  padding: ${Spacing.xLarge};
  overflow-x: auto;
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
  specs: SpecGroup[];
}

const demos: Demo[] = [
  {
    id: "loader-button",
    label: "Loader button",
    description:
      'This loading button is used for actions like "Ready for pickup" and "Picked up by Dasher" to enable Mx to cancel the action if performed by mistake.',
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
];

// ============================================================================
// COMPONENT
// ============================================================================

export const Home = () => {
  const [activeDemo, setActiveDemo] = useState(demos[0].id);
  const [showSpecs, setShowSpecs] = useState(true);

  const currentDemo = demos.find((d) => d.id === activeDemo)!;

  return (
    <PageContainer>
      <Sidebar>
        <SidebarHeader>
          <StackChildren size={Spacing.xxSmall}>
            <Text textStyle={TextStyle.title.medium}>ULOM Animation Demo</Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              Questions? @Oliver on Slack
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
            {activeDemo === "loader-button" && <LoaderButtonDemo />}
            {activeDemo === "orders-home" && <OrdersHomeDemo />}
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
