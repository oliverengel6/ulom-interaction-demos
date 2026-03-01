import { useState, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";
import {
  Button,
  ButtonType,
  ButtonSize,
  Icon,
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

const CardStack = styled.div`
  display: flex;
  gap: 17px;
  padding: 16px 16px;
  overflow-x: auto;
  align-items: flex-start;
`;

// ============================================================================
// ORDER CARD (simplified)
// ============================================================================

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

const PlaceholderLine = styled.div<{ $width?: string; $height?: string }>`
  width: ${(props) => props.$width || "100%"};
  height: ${(props) => props.$height || "14px"};
  background: #f1f1f1;
  border-radius: 6px;
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
// FULL SCREEN ALERT
// ============================================================================

const alertFadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const alertFadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const badgePulse = keyframes`
  0%   { transform: scale(1); }
  50%  { transform: scale(1.08); }
  100% { transform: scale(1); }
`;

const ringExpand = keyframes`
  0%   { transform: scale(1); opacity: 0; }
  50%  { transform: scale(1); opacity: 0; }
  51%  { opacity: 0.85; }
  100% { transform: scale(2.2); opacity: 0; }
`;

const FullScreenOverlay = styled.div<{ $dismissing: boolean; $color: string }>`
  position: absolute;
  inset: 0;
  z-index: 20;
  background: ${(props) => props.$color};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${(props) => (props.$dismissing ? alertFadeOut : alertFadeIn)}
    ${(props) => (props.$dismissing ? Theme.usage.motion.duration.fade.long : Theme.usage.motion.duration.auto.default.xShort)}
    ${(props) => (props.$dismissing ? Theme.usage.motion.easing.subtle.exit : Theme.usage.motion.easing.subtle.enter)}
    forwards;
`;

const CloseBtn = styled.button`
  all: unset;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.15);
  color: #fff;
  font-size: 20px;
  transition: background ${Theme.usage.motion.duration.fade.medium} ${Theme.usage.motion.easing.subtle.default};

  &:hover {
    background: rgba(0, 0, 0, 0.25);
  }
`;

const FullScreenContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
`;

const brandFontMap: Record<string, string> = {
  doordash: '"DD-TTNorms", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  wolt: '"Omnes", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  deliveroo: '"Stratos Deliveroo", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const LargeBadgeWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 140px;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.55);
    animation: ${ringExpand} 1.8s ${Theme.usage.motion.easing.subtle.enter} infinite;
    animation-delay: 0.6s;
    pointer-events: none;
    opacity: 0;
  }
`;

const LargeBadge = styled.div<{ $color: string; $themeId?: string }>`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  font-weight: 700;
  color: ${(props) => props.$color};
  font-family: ${(props) => brandFontMap[props.$themeId || "doordash"]} !important;
  position: relative;
  z-index: 1;
  animation: ${badgePulse} 1.8s ${Theme.usage.motion.easing.subtle.default} infinite;
`;

const AlertTitle = styled.div<{ $themeId?: string }>`
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  font-family: ${(props) => brandFontMap[props.$themeId || "doordash"]} !important;
`;

const AlertSummary = styled.div<{ $themeId?: string }>`
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-top: -8px;
  font-family: ${(props) => brandFontMap[props.$themeId || "doordash"]} !important;
`;

const AlertSubtitle = styled.div<{ $themeId?: string }>`
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 56px;
  font-family: ${(props) => brandFontMap[props.$themeId || "doordash"]} !important;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TriggerButton = styled.div`
  & > button {
    border-color: #181818 !important;
  }
`;

const SelectDropdown = styled.select`
  appearance: none;
  background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 12px center;
  border: 1px solid #d0d0d0;
  border-radius: 10px;
  padding: 8px 32px 8px 14px;
  font-size: 14px;
  font-weight: 500;
  color: #181818;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif !important;
  line-height: 1.4;

  &:focus {
    outline: none;
    border-color: #999;
  }
`;

// ============================================================================
// ORDER DETAIL OVERLAY
// ============================================================================

const scrimFadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const overlayScaleIn = keyframes`
  from { transform: scale(0.92); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
`;

const DetailScrim = styled.div<{ $skipEntrance?: boolean }>`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  padding: 12px;
  animation: ${(props) => (props.$skipEntrance ? "none" : scrimFadeIn)} ${Theme.usage.motion.duration.fade.long} ${Theme.usage.motion.easing.subtle.enter};
`;

const DetailPanel = styled.div<{ $skipEntrance?: boolean }>`
  flex: 1;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${(props) => (props.$skipEntrance ? "none" : overlayScaleIn)} ${Theme.usage.motion.duration.spring.out.short} ${Theme.usage.motion.easing.spring.out.default};
`;

const DetailHeader = styled.div`
  padding: 12px;
`;

const DetailBody = styled.div`
  flex: 1;
  display: flex;
  padding: 0 16px 16px;
`;

const DetailPlaceholderBox = styled.div`
  width: 45%;
  margin-left: auto;
  background: #f5f5f5;
  border-radius: 16px;
`;

const DetailFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
`;

const DetailIconBtn = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f1f1f1;
  flex-shrink: 0;
`;

const DetailOutlineBtn = styled.div`
  height: 44px;
  width: 120px;
  border-radius: 9999px;
  background: #f1f1f1;
  flex-shrink: 0;
`;

const DetailFilledBtn = styled.div`
  height: 44px;
  width: 224px;
  border-radius: 9999px;
  background: #181818;
  flex-shrink: 0;
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

interface AlertType {
  id: string;
  label: string;
  title: string;
  summary: string;
  subtitle: string;
  color: string;
  badgeIcon?: string;
}

const alertTypes: AlertType[] = [
  { id: "new-order", label: "New order", title: "New order", summary: "$16.50 · 3 items", subtitle: "Tap to view", color: "#006a25" },
  { id: "auto-confirmed", label: "Auto-confirmed new order", title: "Order confirmed", summary: "$24.75 · 5 items", subtitle: "Tap to view", color: "#1537C7" },
  { id: "canceled", label: "Canceled order", title: "Canceled order", summary: "$25.30 · 4 items", subtitle: "Tap to view", color: "#B71000" },
  { id: "customer-message", label: "New customer message", title: "New customer message", summary: "Emma E · #123ABC", subtitle: "Tap to view", color: "#313131", badgeIcon: IconType.ChatDefaultLine },
  { id: "support-message", label: "New Support message", title: "New Support message", summary: "Emma E · #123ABC", subtitle: "Tap to view", color: "#313131", badgeIcon: IconType.ChatHelp },
];

// ============================================================================
// COMPONENT
// ============================================================================

function OrderDetailOverlay({ onClose, skipEntrance }: { onClose: () => void; skipEntrance?: boolean }) {
  return (
    <DetailScrim onClick={onClose} $skipEntrance={skipEntrance}>
      <DetailPanel onClick={(e) => e.stopPropagation()} $skipEntrance={skipEntrance}>
        <DetailHeader>
          <IconButton
            iconType={IconType.Close}
            size={IconButtonSize.medium}
            type={IconButtonType.tertiary}
            accessibilityLabel="Close"
            onClick={onClose}
          />
        </DetailHeader>
        <DetailBody>
          <DetailPlaceholderBox />
        </DetailBody>
        <DetailFooter>
          <DetailIconBtn />
          <DetailIconBtn />
          <div style={{ flex: 1 }} />
          <DetailOutlineBtn />
          <DetailFilledBtn />
        </DetailFooter>
      </DetailPanel>
    </DetailScrim>
  );
}

const FADE_OUT_MS = 200;

function FullScreenAlert({ alert, onDismiss, onView, themeId }: { alert: AlertType; onDismiss: () => void; onView: () => void; themeId?: string }) {
  const [dismissing, setDismissing] = useState(false);
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setDismissing(true);
    setTimeout(onDismiss, FADE_OUT_MS);
  }, [onDismiss]);

  const handleView = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    onView();
    setDismissing(true);
    setTimeout(onDismiss, FADE_OUT_MS);
  }, [onDismiss, onView]);

  return (
    <FullScreenOverlay
      $dismissing={dismissing}
      $color={alert.color}
      onClick={handleView}
      style={{ cursor: "pointer" }}
    >
      <CloseBtn onClick={(e) => { e.stopPropagation(); dismiss(); }} aria-label="Close">
        ✕
      </CloseBtn>
      <FullScreenContent>
        <LargeBadgeWrapper>
          <LargeBadge $color={alert.color} $themeId={themeId}>
            {alert.badgeIcon ? (
              <Icon type={alert.badgeIcon as any} size={48} />
            ) : (
              "1"
            )}
          </LargeBadge>
        </LargeBadgeWrapper>
        <AlertTitle $themeId={themeId}>{alert.title}</AlertTitle>
        <AlertSummary $themeId={themeId}>{alert.summary}</AlertSummary>
        <AlertSubtitle $themeId={themeId}>{alert.subtitle}</AlertSubtitle>
      </FullScreenContent>
    </FullScreenOverlay>
  );
}

export function FullScreenAlertsDemo({ themeId }: { themeId?: string }) {
  const [showAlert, setShowAlert] = useState(true);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [openedFromAlert, setOpenedFromAlert] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState(alertTypes[0].id);
  const selectedAlert = alertTypes.find((a) => a.id === selectedAlertId)!;
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

        {showOrderDetail && (
          <OrderDetailOverlay
            onClose={() => { setShowOrderDetail(false); setOpenedFromAlert(false); }}
            skipEntrance={openedFromAlert}
          />
        )}

        {showAlert && (
          <FullScreenAlert
            alert={selectedAlert}
            onDismiss={() => setShowAlert(false)}
            onView={() => { setOpenedFromAlert(true); setShowOrderDetail(true); }}
            themeId={themeId}
          />
        )}
      </DeviceFrame>

      <Controls>
        <SelectDropdown
          value={selectedAlertId}
          onChange={(e) => setSelectedAlertId(e.target.value)}
        >
          {alertTypes.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </SelectDropdown>
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
