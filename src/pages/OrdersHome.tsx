import { useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import {
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
// ORDER CARD
// ============================================================================

const cardBounce = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(0.95); }
  70%  { transform: scale(0.98); }
  100% { transform: scale(1); }
`;

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
  margin-top: 0px;
  position: relative;
  z-index: 1;
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

const Overlay = styled.div`
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
  { id: "#ABC123", name: "David C", time: "20 min", status: "New" },
  { id: "#DEF456", name: "Sarah M", time: "15 min", status: "New" },
  { id: "#GHI789", name: "James L", time: "8 min", status: "In progress" },
  { id: "#JKL012", name: "Emily R", time: "Ready", status: "Ready" },
];

// ============================================================================
// COMPONENT
// ============================================================================

function OrderDetailOverlay({ onClose }: { onClose: () => void }) {
  return (
    <Scrim onClick={onClose}>
      <Overlay onClick={(e) => e.stopPropagation()}>
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
      </Overlay>
    </Scrim>
  );
}

export function OrdersHomeDemo() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [bouncingCard, setBouncingCard] = useState<string | null>(null);
  const handleClose = useCallback(() => {
    setBouncingCard(selectedOrder);
    setSelectedOrder(null);
  }, [selectedOrder]);

  return (
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
        <OrderDetailOverlay onClose={handleClose} />
      )}
    </DeviceFrame>
  );
}
