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
  max-width: 1024px;
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

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 9999px;
  background: #d9dada;
  font-size: 12px;
  font-weight: 600;
  color: #6c6c6c;
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

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  min-height: 48px;
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

const OverlayTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px;
  font-size: 12px;
  color: #000;
`;

const OverlayHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 4px 16px 16px;
`;

const OverlayHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OverlayHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  background: #006a25;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
`;

const OverlayBody = styled.div`
  flex: 1;
  display: flex;
  gap: 24px;
  padding: 0 16px;
  overflow: hidden;
`;

const ItemList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding-bottom: 16px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const ItemQty = styled.div`
  width: 28px;
  flex-shrink: 0;
  padding-top: 2px;
`;

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemPriceEdit = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const SidePanel = styled.div`
  width: 260px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SidePanelCard = styled.div`
  background: #f8f8f8;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SidePanelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
`;

const TagPill = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: #fff;
`;

const OverlayFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #e9e9e9;
`;

const FooterLeft = styled.div`
  display: flex;
  gap: 8px;
`;

const FooterRight = styled.div`
  display: flex;
  gap: 12px;
`;

const ManageButton = styled.div`
  & > button {
    border-color: #181818 !important;
  }
`;

const NavBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 64px;
  padding: 8px 0 6px;
  border-top: 1px solid #f1f1f1;
  color: #aaa;
  font-size: 18px;
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
        <div style={{ padding: 12 }}>
          <IconButton
            iconType={IconType.Close}
            size={IconButtonSize.medium}
            type={IconButtonType.tertiary}
            accessibilityLabel="Close"
            onClick={onClose}
          />
        </div>
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
        <span style={{ color: "#6c6c6c" }}>BT · WiFi · 5G · 100%</span>
      </TopBar>

      <PageHeader>
        <MenuBtn>
          <IconButton
            iconType={IconType.Menu}
            size={IconButtonSize.xLarge}
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
