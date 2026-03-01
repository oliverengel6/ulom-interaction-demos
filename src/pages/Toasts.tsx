import { useState, useCallback, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  Button,
  ButtonType,
  ButtonSize,
  Icon,
  IconColor,
  IconButton,
  IconButtonType,
  IconButtonSize,
  IconType,
  Spacing,
  Theme,
} from "@doordash/prism-react";

// ============================================================================
// LAYOUT
// ============================================================================

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const DeviceFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 740px;
  min-height: 480px;
  background: #fff;
  border-radius: ${Theme.usage.borderRadius.large};
  overflow: hidden;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;

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
  color: ${(props) => (props.$isActive ? "#181818" : "#6c6c6c")};
  background: ${(props) => (props.$isActive ? "#e9e9e9" : "transparent")};
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
  width: ${(props) => props.$width || "100%"};
  height: ${(props) => props.$height || "14px"};
  background: #f1f1f1;
  border-radius: 6px;
`;

const CardStack = styled.div`
  display: flex;
  gap: 17px;
  padding: 16px 16px;
  overflow-x: auto;
  align-items: flex-start;
`;

const Card = styled.div`
  width: 232px;
  min-width: 232px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CardEyebrow = styled.div`
  background: #006a25;
  padding: 8px 24px 8px;
  border-radius: 16px 16px 0 0;
`;

const CardBody = styled.div`
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding: 12px 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PlaceholderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
`;

const ItemPlaceholder = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 0 16px;
`;

const QuantityBox = styled.div`
  width: 36px;
  height: 28px;
  border-radius: 8px;
  background: #f8f8f8;
  flex-shrink: 0;
`;

const ItemLines = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 4px;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(to top, #fff 59%, rgba(255, 255, 255, 0));
`;

const FooterIconPlaceholder = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  background: #f1f1f1;
  flex-shrink: 0;
`;

const FooterButtonPlaceholder = styled.div`
  flex: 1;
  height: 36px;
  border-radius: 9999px;
  background: #f1f1f1;
`;

// ============================================================================
// SUBTLE ALERT (reused from SubtleAlerts)
// ============================================================================

const alertSlideIn = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
`;

const alertSlideOut = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to   { transform: translateY(-100%); opacity: 0; }
`;

const AlertContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
  padding: 28px 48px 0;
`;

const AlertBanner = styled.div<{ $dismissing: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 380px;
  background: #006a25;
  border-radius: 9999px;
  padding: 10px 12px 10px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: ${(props) => (props.$dismissing ? alertSlideOut : alertSlideIn)}
    ${(props) => (props.$dismissing ? Theme.usage.motion.duration.auto.exit.xShort : Theme.usage.motion.duration.auto.exit.medium)}
    ${(props) => (props.$dismissing ? Theme.usage.motion.easing.subtle.exit : Theme.usage.motion.easing.spring.out.default)}
    forwards;
`;

const badgePulse = keyframes`
  0%   { transform: scale(1); }
  50%  { transform: scale(1.12); }
  100% { transform: scale(1); }
`;

const ringExpand = keyframes`
  0%   { transform: scale(1); opacity: 0; }
  50%  { transform: scale(1); opacity: 0; }
  51%  { opacity: 0.85; }
  100% { transform: scale(2.2); opacity: 0; }
`;

const BadgeWrapper = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  flex-shrink: 0;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.55);
    animation: ${ringExpand} 1.8s ${Theme.usage.motion.easing.subtle.enter} infinite;
    pointer-events: none;
  }
`;

const AlertBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #006a25;
  position: relative;
  z-index: 1;
  animation: ${badgePulse} 1.8s ${Theme.usage.motion.easing.subtle.default} infinite;
`;

const AlertText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
`;

const AlertTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
`;

const AlertSubtitle = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
`;

const DismissButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 16px;
  flex-shrink: 0;
`;

// ============================================================================
// TOAST
// ============================================================================

const toastSlideIn = keyframes`
  from { transform: translateY(-12px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
`;

const toastSlideOut = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to   { transform: translateY(-12px); opacity: 0; }
`;

const ToastLayer = styled.div<{ $hasAlert: boolean }>`
  position: absolute;
  top: ${(props) => (props.$hasAlert ? "92px" : "28px")};
  left: 0;
  right: 0;
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 48px;
  transition: top ${Theme.usage.motion.duration.auto.default.xShort} ${Theme.usage.motion.easing.spring.out.default};
`;

const ToastWrapper = styled.div<{ $collapsing: boolean }>`
  max-height: ${(props) => (props.$collapsing ? "0px" : "120px")};
  margin-bottom: ${(props) => (props.$collapsing ? "0px" : "8px")};
  overflow: ${(props) => (props.$collapsing ? "hidden" : "visible")};
  transition: max-height ${Theme.usage.motion.duration.fade.long} ${Theme.usage.motion.easing.subtle.default},
    margin-bottom ${Theme.usage.motion.duration.fade.long} ${Theme.usage.motion.easing.subtle.default};

  &:last-child {
    margin-bottom: 0;
  }
`;

const ToastChip = styled.div<{ $dismissing: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 380px;
  animation: ${(props) => (props.$dismissing ? toastSlideOut : toastSlideIn)}
    ${Theme.usage.motion.duration.fade.long}
    ${(props) => (props.$dismissing ? Theme.usage.motion.easing.subtle.exit : Theme.usage.motion.easing.subtle.enter)}
    forwards;
`;

const ToastIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToastBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const ToastTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #181818;
`;

const ToastMessage = styled.span`
  font-size: 13px;
  color: #6c6c6c;
`;

const ToastAction = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #1537C7;
  flex-shrink: 0;
  white-space: nowrap;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;

const TriggerButton = styled.div`
  & > button {
    border-color: #181818 !important;
  }
`;

// ============================================================================
// DATA
// ============================================================================

const tabs = [
  { width: "52px", active: true },
  { width: "108px", active: false },
  { width: "92px", active: false },
  { width: "68px", active: false },
];

const orders = [
  { id: "#ABC123" },
  { id: "#DEF456" },
  { id: "#GHI789" },
  { id: "#JKL012" },
];

interface ToastData {
  id: string;
  title?: string;
  message: string;
  iconType?: string;
  iconColor?: string;
  action?: string;
  dismissing?: boolean;
  collapsing?: boolean;
}

const TOAST_DURATION = 4000;

// ============================================================================
// COMPONENTS
// ============================================================================

function SubtleAlert({ onDismiss }: { onDismiss: () => void }) {
  const [dismissing, setDismissing] = useState(false);

  const handleDismiss = useCallback(() => {
    setDismissing(true);
  }, []);

  return (
    <AlertContainer>
      <AlertBanner
        $dismissing={dismissing}
        onAnimationEnd={() => {
          if (dismissing) onDismiss();
        }}
      >
        <BadgeWrapper>
          <AlertBadge>1</AlertBadge>
        </BadgeWrapper>
        <AlertText>
          <AlertTitle>New order</AlertTitle>
          <AlertSubtitle>$16.50 · 3 items</AlertSubtitle>
        </AlertText>
        <DismissButton onClick={handleDismiss}>✕</DismissButton>
      </AlertBanner>
    </AlertContainer>
  );
}

function Toast({
  toast,
  onCollapse,
  onRemove,
}: {
  toast: ToastData;
  onCollapse: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <ToastWrapper
      $collapsing={!!toast.collapsing}
      onTransitionEnd={() => {
        if (toast.collapsing) onRemove(toast.id);
      }}
    >
      <ToastChip
        $dismissing={!!toast.dismissing}
        onAnimationEnd={() => {
          if (toast.dismissing) onCollapse(toast.id);
        }}
      >
        {toast.iconType && (
          <ToastIcon>
            <Icon
              type={toast.iconType as any}
              color={(toast.iconColor || IconColor.icon.default) as any}
            />
          </ToastIcon>
        )}
        <ToastBody>
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          <ToastMessage>{toast.message}</ToastMessage>
        </ToastBody>
        {toast.action && <ToastAction>{toast.action}</ToastAction>}
      </ToastChip>
    </ToastWrapper>
  );
}

let toastCounter = 0;

export function ToastsDemo() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => {
      if (prev.length >= 3) return prev;
      return [...prev, { ...toast, id }];
    });
    const timer = setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t))
      );
    }, TOAST_DURATION);
    timersRef.current[id] = timer;
  }, []);

  const collapseToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, collapsing: true } : t))
    );
  }, []);

  const removeToast = useCallback((id: string) => {
    clearTimeout(timersRef.current[id]);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      addToast({
        iconType: IconType.CheckCircleFill,
        iconColor: IconColor.positive.default,
        message: "Order marked as ready for pickup",
      });
    }, 500);
    return () => clearTimeout(t);
  }, [addToast]);

  return (
    <Wrapper>
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

        <CardStack>
          {orders.map((order) => (
            <Card key={order.id}>
              <CardEyebrow />
              <CardBody>
                <PlaceholderBlock>
                  <PlaceholderLine $width="55%" $height="18px" />
                  <PlaceholderLine $width="30%" />
                  <PlaceholderLine $width="40%" />
                </PlaceholderBlock>

                {[0, 1, 2].map((i) => (
                  <ItemPlaceholder key={i}>
                    <QuantityBox />
                    <ItemLines>
                      <PlaceholderLine $width="60%" />
                      <PlaceholderLine $width="45%" $height="12px" />
                      <PlaceholderLine $width="45%" $height="12px" />
                    </ItemLines>
                  </ItemPlaceholder>
                ))}

                <CardFooter>
                  <FooterIconPlaceholder />
                  <FooterButtonPlaceholder />
                </CardFooter>
              </CardBody>
            </Card>
          ))}
        </CardStack>

        {showAlert && <SubtleAlert onDismiss={() => setShowAlert(false)} />}

        <ToastLayer $hasAlert={showAlert}>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onCollapse={collapseToast} onRemove={removeToast} />
          ))}
        </ToastLayer>
      </DeviceFrame>

      <Controls>
        <TriggerButton>
          <Button
            type={ButtonType.tertiary}
            size={ButtonSize.medium}
            onClick={() =>
              addToast({
                iconType: IconType.CheckCircleFill,
                iconColor: IconColor.positive.default,
                message: "Order marked as ready for pickup",
              })
            }
          >
            Success toast
          </Button>
        </TriggerButton>
        <TriggerButton>
          <Button
            type={ButtonType.tertiary}
            size={ButtonSize.medium}
            onClick={() =>
              addToast({
                iconType: IconType.ErrorFill,
                iconColor: IconColor.negative.default,
                title: "Update failed",
                message: "Could not update order status",
                action: "Retry",
              })
            }
          >
            Error toast
          </Button>
        </TriggerButton>
        <TriggerButton>
          <Button
            type={ButtonType.tertiary}
            size={ButtonSize.medium}
            onClick={() => {
              setShowAlert(false);
              requestAnimationFrame(() => setShowAlert(true));
            }}
          >
            Trigger alert
          </Button>
        </TriggerButton>
      </Controls>
    </Wrapper>
  );
}
