import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import styled, { keyframes, css } from "styled-components";
import {
  Button,
  ButtonType,
  ButtonSize,
  IconButton,
  IconButtonType,
  IconButtonSize,
  IconType,
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
import { NavMenuDemo } from "./NavMenu";
import { ToastsDemo } from "./Toasts";
import { OrderSortingDiagram } from "./OrderSorting";
import { NotificationLogicDiagram } from "./NotificationLogic";

// ============================================================================
// LAYOUT
// ============================================================================

const MOBILE_BREAKPOINT = "1024px";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #fff;
`;

const Sidebar = styled.nav<{ $mobileOpen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  border-right: 1px solid ${IconColor.border.default};
  display: flex;
  flex-direction: column;
  background-color: #fff;
  z-index: 110;
  overflow-y: auto;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    transform: ${(p) => (p.$mobileOpen ? "translateX(0)" : "translateX(-100%)")};
    transition: transform 200ms ease;
    box-shadow: ${(p) => (p.$mobileOpen ? "4px 0 24px rgba(0, 0, 0, 0.12)" : "none")};
  }
`;

const MobileScrim = styled.div<{ $visible: boolean }>`
  display: none;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 105;
    opacity: ${(p) => (p.$visible ? 1 : 0)};
    pointer-events: ${(p) => (p.$visible ? "auto" : "none")};
    transition: opacity 200ms ease;
  }
`;

const MobileTopBar = styled.div`
  display: none;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: flex;
    align-items: center;
    gap: ${Spacing.small};
    padding: ${Spacing.small} ${Spacing.medium};
    border-bottom: 1px solid ${IconColor.border.default};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 100;
  }
`;

const MobileTopBarTitle = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 20px;
  overflow: hidden;
`;

const MobileTopBarTitleText = styled.span<{ $visible: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? "0" : "8px")});
  transition: opacity 200ms ease, transform 200ms ease;
`;

const MobileTopBarSpacer = styled.div`
  display: none;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: block;
    height: calc(52px + ${Spacing.xLarge});
  }
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

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    margin-left: 0;
    padding: ${Spacing.medium} ${Spacing.medium};
  }
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

const WipBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: ${Theme.usage.borderRadius.full};
  background: #FFF0C2;
  color: #8A6500;
  font-family: "DD-TTNorms", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 16px;
  text-transform: uppercase;
  flex-shrink: 0;
`;

// ============================================================================
// THEME SWITCHER
// ============================================================================

const DoorDashLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="5.3" fill="#FF3008" />
    <path d="M19.55 9.533a5.078 5.078 0 00-4.42-2.656H4.512a.43.43 0 00-.307.737l2.65 2.667c.228.228.52.35.83.334h8.089a1.04 1.04 0 010 2.08h-5.56a.43.43 0 00-.306.737l2.65 2.667a1.2 1.2 0 00.844.301h2.532c3.276 0 5.748-3.506 3.617-6.867z" fill="white" />
  </svg>
);

const WoltLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="woltGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#55C4F0" />
        <stop offset="100%" stopColor="#009DE0" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="5.3" fill="url(#woltGrad)" />
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="Omnes, 'Nunito', 'Varela Round', sans-serif" letterSpacing="-0.5">Wolt</text>
  </svg>
);

const DeliverooLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="5.3" fill="#00CCBC" />
    <path d="M15.489 3l-.845 7.938-1.443-5.943-4.524.949 1.443 6.692-6.521 1.366 1.15 5.345L16.374 21l2.624-5.808L17.746 3.477 15.489 3zm-4.102 10.208a.566.566 0 01.241.049c.156.07.42.218.473.444.077.326.003.599-.234.813v.002c-.236.213-.549.194-.88.085-.331-.109-.478-.504-.353-.982.093-.355.533-.408.753-.412zm3.107.411c.335-.009.624.14.787.407.163.268.08.563-.091.857h-.002c-.172.294-.623.334-1.067.12-.299-.145-.298-.513-.265-.737a.691.691 0 01.145-.335c.106-.133.286-.306.492-.312z" fill="white" />
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
  wip?: boolean;
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
          { label: "Duration", value: "3000ms (custom)" },
          { label: "Easing", value: "easing.linear" },
          { label: "Direction", value: "Left → Right" },
        ],
      },
      {
        title: "Cancel — bar retract",
        specs: [
          { label: "Duration", value: "duration.functional.exit.xShort (150ms)" },
          { label: "Easing", value: "easing.subtle.exit" },
          { label: "Direction", value: "Right → Left" },
        ],
      },
      {
        title: "Complete — bar fade",
        specs: [
          { label: "Duration", value: "duration.auto.default.short (400ms)" },
          { label: "Easing", value: "easing.subtle.enter" },
        ],
      },
      {
        title: "Cancel — text shake",
        specs: [
          { label: "Duration", value: "duration.functional.default.long (500ms)" },
          { label: "Easing", value: "easing.subtle.enter" },
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
          { label: "Duration", value: "duration.spring.out.short (250ms)" },
          { label: "Easing", value: "easing.spring.out.default" },
          { label: "Scale", value: "0.92 → 1" },
          { label: "Opacity", value: "0 → 1" },
        ],
      },
      {
        title: "Scrim — fade in",
        specs: [
          { label: "Duration", value: "duration.fade.long (200ms)" },
          { label: "Easing", value: "easing.subtle.enter" },
          { label: "Opacity", value: "0 → 0.5" },
        ],
      },
      {
        title: "Card — close bounce",
        specs: [
          { label: "Duration", value: "duration.auto.default.short (400ms)" },
          { label: "Easing", value: "easing.subtle.default" },
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
      "A non-blocking banner that slides in from the top to surface timely updates.",
    instruction: "",
    specs: [
      {
        title: "Alert — slide in",
        specs: [
          { label: "Duration", value: "duration.auto.exit.medium (350ms)" },
          { label: "Easing", value: "easing.spring.out.default" },
          { label: "Transform", value: "translateY(-100%) → 0" },
          { label: "Opacity", value: "0 → 1" },
        ],
      },
      {
        title: "Alert — slide out",
        specs: [
          { label: "Duration", value: "duration.auto.exit.xShort (250ms)" },
          { label: "Easing", value: "easing.subtle.exit" },
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
          { label: "Duration", value: "duration.auto.default.xShort (300ms)" },
          { label: "Easing", value: "easing.subtle.enter" },
          { label: "Opacity", value: "0 → 1" },
        ],
      },
      {
        title: "Badge — pulse + ripple",
        specs: [
          { label: "Duration", value: "1800ms (custom)" },
          { label: "Easing (pulse)", value: "easing.subtle.default" },
          { label: "Easing (ripple)", value: "easing.subtle.enter" },
          { label: "Loop", value: "Infinite" },
          { label: "Scale", value: "1 → 1.08 → 1" },
          { label: "Ring scale", value: "1 → 2.2" },
        ],
      },
      {
        title: "Overlay — fade out",
        specs: [
          { label: "Duration", value: "duration.fade.long (200ms)" },
          { label: "Easing", value: "easing.subtle.exit" },
          { label: "Opacity", value: "1 → 0" },
        ],
      },
    ],
  },
  {
    id: "nav-menu",
    label: "Navigation menu",
    description:
      "A side sheet that slides in from the left to reveal the navigation menu, with a scrim overlay on the main content.",
    instruction: "Tap the hamburger menu to open, tap scrim or ✕ to close",
    specs: [
      {
        title: "Sheet — slide in",
        specs: [
          { label: "Duration", value: "duration.auto.default.xShort (300ms)" },
          { label: "Easing", value: "easing.spring.out.default" },
          { label: "Transform", value: "translateX(-100%) → translateX(0)" },
        ],
      },
      {
        title: "Sheet — slide out",
        specs: [
          { label: "Duration", value: "duration.functional.exit.short (200ms)" },
          { label: "Easing", value: "easing.subtle.exit" },
          { label: "Transform", value: "translateX(0) → translateX(-100%)" },
        ],
      },
      {
        title: "Scrim — fade in",
        specs: [
          { label: "Duration", value: "duration.fade.long (200ms)" },
          { label: "Easing", value: "easing.subtle.enter" },
          { label: "Opacity", value: "0 → 1" },
        ],
      },
      {
        title: "Scrim — fade out",
        specs: [
          { label: "Duration", value: "duration.fade.long (200ms)" },
          { label: "Easing", value: "easing.subtle.exit" },
          { label: "Opacity", value: "1 → 0" },
        ],
      },
    ],
  },
  {
    id: "toasts",
    label: "Toasts",
    description:
      "Non-blocking feedback toasts that stack from the top. Demonstrates multi-toast stacking and coexistence with a subtle alert.",
    instruction: "Use buttons below to trigger toasts and alerts",
    specs: [
      {
        title: "Toast — slide in",
        specs: [
          { label: "Duration", value: "duration.fade.long (200ms)" },
          { label: "Easing", value: "easing.subtle.enter" },
          { label: "Transform", value: "translateY(-12px) → 0" },
          { label: "Opacity", value: "0 → 1" },
        ],
      },
      {
        title: "Toast — slide out",
        specs: [
          { label: "Duration", value: "duration.fade.long (200ms)" },
          { label: "Easing", value: "easing.subtle.exit" },
          { label: "Transform", value: "0 → translateY(-12px)" },
          { label: "Opacity", value: "1 → 0" },
        ],
      },
      {
        title: "Toast layer — reposition",
        specs: [
          { label: "Duration", value: "duration.auto.default.xShort (300ms)" },
          { label: "Easing", value: "easing.spring.out.default" },
          { label: "Property", value: "top offset" },
        ],
      },
      {
        title: "Auto dismiss",
        specs: [
          { label: "Duration", value: "4000ms" },
          { label: "Max visible", value: "3" },
        ],
      },
    ],
  },
];

const behaviors: Demo[] = [
  {
    id: "order-sorting",
    label: "KDS order sorting",
    description:
      "How orders are sorted and prioritized in the KDS orders home view.",
    instruction: "",
    specs: [],
  },
  {
    id: "notification-logic",
    label: "Notification logic",
    description:
      "When to show a full screen alert vs. a subtle alert, and how subtle alerts escalate to full screen when the Mx is idle.",
    instruction: "",
    specs: [],
    wip: true,
  },
];

const allPages = [...demos, ...behaviors];

// ============================================================================
// COMPONENT
// ============================================================================

export const Home = () => {
  const { demoId } = useParams<{ demoId: string }>();
  const navigate = useNavigate();
  const activeDemo = allPages.find((d) => d.id === demoId) ? demoId! : demos[0].id;
  const setActiveDemo = useCallback((id: string) => navigate(`/${id}`), [navigate]);

  const [showSpecs, setShowSpecs] = useState(true);
  const [activeThemeId, setActiveThemeId] = useState("doordash");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitleVisible, setPageTitleVisible] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pageTitleRef = useRef<HTMLSpanElement>(null);

  const currentDemo = allPages.find((d) => d.id === activeDemo)!;
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

  useEffect(() => {
    const el = pageTitleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPageTitleVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeDemo]);

  const handleNavClick = useCallback((id: string) => {
    setActiveDemo(id);
    setSidebarOpen(false);
  }, [setActiveDemo]);

  return (
    <PageContainer>
      <MobileScrim $visible={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <Sidebar $mobileOpen={sidebarOpen}>
        <SidebarHeader>
          <StackChildren size={Spacing.xxSmall}>
            <Text textStyle={TextStyle.title.medium}><span style={{ opacity: 0.7 }}>ULOM</span><br />System Demos</Text>
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
              onClick={() => handleNavClick(demo.id)}
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

          <SidebarSectionLabel style={{ marginTop: 12 }}>
            <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>
              BEHAVIOR
            </Text>
          </SidebarSectionLabel>
          {behaviors.map((item) => (
            <SidebarItem
              key={item.id}
              $isActive={activeDemo === item.id}
              onClick={() => handleNavClick(item.id)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Text
                  textStyle={
                    activeDemo === item.id
                      ? TextStyle.label.medium.strong
                      : TextStyle.label.medium.default
                  }
                >
                  {item.label}
                </Text>
                {item.wip && <WipBadge>WIP</WipBadge>}
              </span>
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
        <MobileTopBar>
          <IconButton
            iconType={IconType.Menu}
            size={IconButtonSize.medium}
            type={IconButtonType.tertiary}
            accessibilityLabel="Open menu"
            onClick={() => setSidebarOpen(true)}
          />
          <MobileTopBarTitle>
            <MobileTopBarTitleText $visible={pageTitleVisible}>
              <Text textStyle={TextStyle.label.medium.strong}>
                <span style={{ opacity: 0.5 }}>ULOM</span> System Demos
              </Text>
            </MobileTopBarTitleText>
            <MobileTopBarTitleText $visible={!pageTitleVisible}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Text textStyle={TextStyle.label.medium.strong}>{currentDemo.label}</Text>
                {currentDemo.wip && <WipBadge>WIP</WipBadge>}
              </span>
            </MobileTopBarTitleText>
          </MobileTopBarTitle>
        </MobileTopBar>
        <MobileTopBarSpacer />
        <StackChildren size={Spacing.large}>
          <StackChildren size={Spacing.xSmall}>
            <span ref={pageTitleRef} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Text textStyle={TextStyle.title.large}>{currentDemo.label}</Text>
              {currentDemo.wip && <WipBadge>WIP</WipBadge>}
            </span>
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
                {activeDemo === "nav-menu" && <NavMenuDemo />}
                {activeDemo === "toasts" && <ToastsDemo />}
                {activeDemo === "order-sorting" && <OrderSortingDiagram />}
                {activeDemo === "notification-logic" && <NotificationLogicDiagram />}
              </DemoContent>
            </Theming>
            {currentDemo.instruction && (
              <InstructionHint>
                <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
                  {currentDemo.instruction}
                </Text>
              </InstructionHint>
            )}
          </DemoArea>

          {currentDemo.specs.length > 0 && (
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
          )}
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
        ? css`${shakeKeyframes} ${Theme.usage.motion.duration.functional.default.long} ${Theme.usage.motion.easing.subtle.enter}`
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
      barTransition = `transform 3000ms ${Theme.usage.motion.easing.linear}`;
      innerOpacity = 1;
      innerTransition = "none";
      break;
    case "completing":
      barScale = 1;
      barTransition = "none";
      innerOpacity = 0;
      innerTransition = `opacity ${Theme.usage.motion.duration.auto.default.short} ${Theme.usage.motion.easing.subtle.enter}`;
      break;
    case "cancelling":
      barScale = 0;
      barTransition = `transform ${Theme.usage.motion.duration.functional.exit.xShort} ${Theme.usage.motion.easing.subtle.exit}`;
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
