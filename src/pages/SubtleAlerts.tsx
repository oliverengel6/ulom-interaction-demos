import { useState, useCallback, useRef } from "react";
import styled, { keyframes } from "styled-components";
import {
  Button,
  ButtonType,
  ButtonSize,
  IconButton,
  IconButtonType,
  IconButtonSize,
  IconType,
  Spacing,
  Theme,
} from "@doordash/prism-react";

// ============================================================================
// LAYOUT (reused from OrdersHome)
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

const Card = styled.div<{ $bouncing?: boolean }>`
  width: 232px;
  min-width: 232px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  position: relative;
  animation: ${(props) => (props.$bouncing ? cardBounce : "none")} 450ms ease-in-out;
`;

const CardEyebrow = styled.div`
  background: #006a25;
  padding: 8px 24px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const Scrim = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  padding: 12px;
  animation: ${scrimFadeIn} 200ms ease-out;
`;

const OverlayPanel = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${overlayScaleIn} 250ms cubic-bezier(0.2, 0, 0, 1);
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

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const cardBounce = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(0.95); }
  70%  { transform: scale(0.98); }
  100% { transform: scale(1); }
`;

// ============================================================================
// SUBTLE ALERT
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

const AlertBanner = styled.div<{ $dismissing: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 380px;
  background: ${(props) => props.$color};
  border-radius: 9999px;
  padding: 10px 12px 10px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: ${(props) => (props.$dismissing ? alertSlideOut : alertSlideIn)} 
    ${(props) => (props.$dismissing ? "250ms" : "350ms")} 
    ${(props) => (props.$dismissing ? "ease-in" : "cubic-bezier(0.2, 0, 0, 1)")}
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
    animation: ${ringExpand} 1.8s ease-out infinite;
    pointer-events: none;
  }
`;

const AlertBadge = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.$color};
  position: relative;
  z-index: 1;
  animation: ${badgePulse} 1.8s ease-in-out infinite;
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

const AlertActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const ViewButton = styled.button<{ $color: string }>`
  all: unset;
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 9999px;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.$color};
`;

const DismissButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  font-size: 18px;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const TriggerButton = styled.div`
  & > button {
    border-color: #181818 !important;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  subtitle: string;
  color: string;
}

const alertTypes: AlertType[] = [
  { id: "new-order", label: "New order", title: "New order", subtitle: "$16.50 · 3 items", color: "#006a25" },
  { id: "auto-confirmed", label: "Auto-confirmed new order", title: "Order confirmed", subtitle: "$24.75 · 5 items", color: "#1537C7" },
  { id: "canceled", label: "Canceled order", title: "Canceled order", subtitle: "$25.30 · 4 items", color: "#B71000" },
];

// ============================================================================
// COMPONENT
// ============================================================================

function SubtleAlert({ alert, onDismiss, onView }: { alert: AlertType; onDismiss: () => void; onView: () => void }) {
  const [dismissing, setDismissing] = useState(false);
  const viewingRef = useRef(false);

  const handleDismiss = useCallback(() => {
    setDismissing(true);
  }, []);

  const handleView = useCallback(() => {
    viewingRef.current = true;
    setDismissing(true);
  }, []);

  return (
    <AlertContainer>
      <AlertBanner
        $dismissing={dismissing}
        $color={alert.color}
        onAnimationEnd={() => {
          if (dismissing) {
            onDismiss();
            if (viewingRef.current) onView();
          }
        }}
      >
        <BadgeWrapper>
          <AlertBadge $color={alert.color}>1</AlertBadge>
        </BadgeWrapper>
        <AlertText>
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertSubtitle>{alert.subtitle}</AlertSubtitle>
        </AlertText>
        <AlertActions>
          <ViewButton $color={alert.color} onClick={handleView}>View</ViewButton>
          <DismissButton onClick={handleDismiss}>✕</DismissButton>
        </AlertActions>
      </AlertBanner>
    </AlertContainer>
  );
}

export function SubtleAlertsDemo() {
  const [showAlert, setShowAlert] = useState(true);
  const [selectedAlertId, setSelectedAlertId] = useState(alertTypes[0].id);
  const selectedAlert = alertTypes.find((a) => a.id === selectedAlertId)!;
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [bouncingCard, setBouncingCard] = useState<string | null>(null);
  const handleOverlayClose = useCallback(() => {
    setBouncingCard(selectedOrder);
    setSelectedOrder(null);
  }, [selectedOrder]);

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
            <Card
              key={order.id}
              $bouncing={bouncingCard === order.id}
              onAnimationEnd={() => setBouncingCard(null)}
              onClick={() => setSelectedOrder(order.id)}
              style={{ cursor: "pointer" }}
            >
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

        {selectedOrder && (
          <Scrim onClick={handleOverlayClose}>
            <OverlayPanel onClick={(e) => e.stopPropagation()}>
              <DetailHeader>
                <IconButton
                  iconType={IconType.Close}
                  size={IconButtonSize.medium}
                  type={IconButtonType.tertiary}
                  accessibilityLabel="Close"
                  onClick={handleOverlayClose}
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
            </OverlayPanel>
          </Scrim>
        )}

        {showAlert && (
          <SubtleAlert
            alert={selectedAlert}
            onDismiss={() => setShowAlert(false)}
            onView={() => setSelectedOrder(orders[0].id)}
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
