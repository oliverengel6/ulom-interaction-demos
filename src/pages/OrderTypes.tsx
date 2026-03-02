import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  Text,
  TextStyle,
  TextColor,
  IconColor,
  Spacing,
  Theme,
  Tooltip,
} from "@doordash/prism-react";

// ============================================================================
// LAYOUT
// ============================================================================

const Wrapper = styled.div`
  width: 100%;
  padding: 0 0 40px;
`;

const TabRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${Spacing.xSmall};
  margin-bottom: ${Spacing.large};
`;

const Tab = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  padding: ${Spacing.xSmall} ${Spacing.medium};
  border-radius: ${Theme.usage.borderRadius.full};
  background: ${(p) =>
    p.$active
      ? Theme.usage.color.background.inverse.default
      : Theme.usage.color.background.strong.default};
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: ${(p) =>
      p.$active
        ? Theme.usage.color.background.inverse.default
        : Theme.usage.color.background.strong.hovered};
  }
`;

// ============================================================================
// DIAGRAM PRIMITIVES
// ============================================================================

const DiagramContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Node = styled.div<{ $variant?: "default" | "accent" | "subtle" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: ${Spacing.small} ${Spacing.large};
  border-radius: ${Theme.usage.borderRadius.medium};
  text-align: center;
  min-width: 180px;
  margin-bottom: 4px;
  background: ${(p) => {
    switch (p.$variant) {
      case "subtle":
        return Theme.usage.color.background.default;
      default:
        return Theme.usage.color.background.strong.default;
    }
  }};
  border: 1.5px solid ${(p) =>
    p.$variant === "subtle"
      ? Theme.usage.color.border.default
      : "transparent"};
`;


const SectionTitle = styled.div`
  margin: 28px 0 12px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${Spacing.small};
  width: 100%;
  max-width: 560px;
`;

const CategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${Spacing.medium};
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.background.default};
  border: 1.5px solid ${Theme.usage.color.border.default};
`;

const TypeChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: ${Theme.usage.borderRadius.small};
  background: ${Theme.usage.color.background.strong.default};
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.small};
  width: 100%;
  max-width: 560px;
`;

const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${Spacing.medium};
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.background.default};
  border: 1.5px solid ${Theme.usage.color.border.default};
`;

const SourceRef = styled.div`
  margin-top: 32px;
  text-align: center;
`;

const CodeChip = styled.code`
  background: ${Theme.usage.color.background.strong.default};
  padding: 1px 6px;
  border-radius: ${Theme.usage.borderRadius.small};
  font-size: 11px;
`;

// ============================================================================
// BRAND DROPDOWN
// ============================================================================

const DoorDashLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="5.3" fill="#FF3008" />
    <path d="M19.55 9.533a5.078 5.078 0 00-4.42-2.656H4.512a.43.43 0 00-.307.737l2.65 2.667c.228.228.52.35.83.334h8.089a1.04 1.04 0 010 2.08h-5.56a.43.43 0 00-.306.737l2.65 2.667a1.2 1.2 0 00.844.301h2.532c3.276 0 5.748-3.506 3.617-6.867z" fill="white" />
  </svg>
);

const WoltLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="woltGradOrderTypes" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#55C4F0" />
        <stop offset="100%" stopColor="#009DE0" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="5.3" fill="url(#woltGradOrderTypes)" />
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="Omnes, 'Nunito', 'Varela Round', sans-serif" letterSpacing="-0.5">Wolt</text>
  </svg>
);

const DeliverooLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="5.3" fill="#00CCBC" />
    <path d="M15.489 3l-.845 7.938-1.443-5.943-4.524.949 1.443 6.692-6.521 1.366 1.15 5.345L16.374 21l2.624-5.808L17.746 3.477 15.489 3zm-4.102 10.208a.566.566 0 01.241.049c.156.07.42.218.473.444.077.326.003.599-.234.813v.002c-.236.213-.549.194-.88.085-.331-.109-.478-.504-.353-.982.093-.355.533-.408.753-.412zm3.107.411c.335-.009.624.14.787.407.163.268.08.563-.091.857h-.002c-.172.294-.623.334-1.067.12-.299-.145-.298-.513-.265-.737a.691.691 0 01.145-.335c.106-.133.286-.306.492-.312z" fill="white" />
  </svg>
);

type Brand = "doordash" | "wolt" | "deliveroo";

interface BrandOption {
  id: Brand;
  label: string;
  logo: () => JSX.Element;
}

const brandOptions: BrandOption[] = [
  { id: "doordash", label: "DoorDash", logo: DoorDashLogo },
  { id: "wolt", label: "Wolt", logo: WoltLogo },
  { id: "deliveroo", label: "Deliveroo", logo: DeliverooLogo },
];

const TabDivider = styled.div`
  width: 1px;
  height: 20px;
  background: ${IconColor.border.default};
  margin: 0 ${Spacing.xSmall};
`;

const BrandDropdownWrapper = styled.div`
  position: relative;
`;

const BrandDropdownButton = styled.button`
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

const BrandDropdownChevron = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  transform: ${(p) => (p.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 150ms ease;
  font-size: 8px;
  color: ${TextColor.text.subdued.default};
  margin-left: 2px;
`;

const BrandDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: white;
  border: 1px solid ${IconColor.border.default};
  border-radius: ${Theme.usage.borderRadius.medium};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
  min-width: 140px;
`;

const BrandDropdownItem = styled.button<{ $isActive: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${Spacing.xSmall};
  width: 100%;
  padding: ${Spacing.xSmall} ${Spacing.small};
  box-sizing: border-box;
  background-color: ${(p) => (p.$isActive ? IconColor.background.hovered : "transparent")};

  &:hover {
    background-color: ${IconColor.background.hovered};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${Spacing.small};
  padding: 60px ${Spacing.large};
  text-align: center;
`;

// ============================================================================
// TAB DATA
// ============================================================================

type FilterTab = "overview" | "fulfillment" | "attributes" | "compatibility" | "flags";

const TABS: { id: FilterTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "compatibility", label: "Compatibility" },
];

// ============================================================================
// TAB DIAGRAMS
// ============================================================================

function OverviewDiagram() {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>Every order</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Classified across multiple dimensions
        </Text>
      </Node>


      <SectionTitle>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          PRODUCT LINE
        </Text>
      </SectionTitle>


      <CategoryGrid>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Marketplace</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Standard DoorDash / Caviar orders
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Storefront</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Online ordering from merchant's own website
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Drive</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            White-label / external checkout delivery
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Grocery</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Grocery-targeted orders with shop & deliver
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Catering</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Large / scheduled catering orders
          </Text>
        </CategoryCard>
      </CategoryGrid>



      <SectionTitle>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          FULFILLMENT TYPE
        </Text>
      </SectionTitle>


      <CategoryGrid>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Delivery</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Dasher delivers to customer
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Pickup</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Customer picks up from store
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Dine-in</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Customer orders and eats in-store
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Shipping</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Merchant ships directly to customer
          </Text>
        </CategoryCard>
      </CategoryGrid>



      <SectionTitle>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          SPECIALTY ATTRIBUTES
        </Text>
      </SectionTitle>


      <CategoryGrid>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Group order</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Multiple participants contribute to one cart
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Gift order</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Purchased and sent as a gift to a recipient
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Scheduled</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Placed now for a future delivery / pickup time
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>DashPass</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Subscriber order with reduced fees
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Alcohol</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Contains alcohol; requires ID verification
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Bundle</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Items from multiple stores in one delivery
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Batched</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Dasher picks up multiple separate orders in one trip
          </Text>
        </CategoryCard>
      </CategoryGrid>

      <SourceRef>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Source: <CodeChip>OrderType</CodeChip> enum, <CodeChip>OrderFulfillmentType</CodeChip>, cart flags
        </Text>
      </SourceRef>
    </DiagramContainer>
  );
}

function FulfillmentDiagram() {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>Fulfillment types</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          How the order reaches the customer
        </Text>
      </Node>


      <ItemList>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>Delivery</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            A Dasher picks up from the store and delivers to the customer's address. This is the most common fulfillment type.
          </Text>
          <ChipRow>
            <TypeChip>DX fleet</TypeChip>
            <TypeChip>MX fleet</TypeChip>
          </ChipRow>
        </ItemCard>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>Pickup</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Customer places an order through the app and picks it up at the store themselves. No Dasher involved.
          </Text>
        </ItemCard>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>Dine-in</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Customer orders from their table via the app and eats in-store. Food is brought to them or they pick up at a counter.
          </Text>
        </ItemCard>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>Shipping</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            The merchant ships the order directly to the customer via a carrier (e.g. USPS, FedEx). Used for non-perishable goods.
          </Text>
        </ItemCard>
      </ItemList>



      <SectionTitle>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          TIMING
        </Text>
      </SectionTitle>


      <CategoryGrid>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>ASAP</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Order should be prepared and fulfilled as soon as possible
          </Text>
        </CategoryCard>
        <CategoryCard>
          <Text textStyle={TextStyle.label.small.strong}>Scheduled</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Order has a future delivery or pickup time chosen by the customer
          </Text>
        </CategoryCard>
      </CategoryGrid>

      <SourceRef>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Source: <CodeChip>OrderFulfillmentType</CodeChip> enum, <CodeChip>StorefrontOrderType</CodeChip>
        </Text>
      </SourceRef>
    </DiagramContainer>
  );
}

function AttributesDiagram() {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>Specialty order attributes</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Any order can have one or more of these
        </Text>
      </Node>


      <ItemList>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>Group order</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Multiple people add items to a shared cart. The creator sets the payment rules.
          </Text>
          <ChipRow>
            <TypeChip>Creator pays all</TypeChip>
            <TypeChip>Split bill</TypeChip>
            <TypeChip>Cart topper</TypeChip>
            <TypeChip>Expensed</TypeChip>
          </ChipRow>
        </ItemCard>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>Gift order</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            The customer purchases the order as a gift for someone else. The recipient gets a notification and can choose when to redeem it.
          </Text>
        </ItemCard>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>DashPass order</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Placed by a DashPass subscriber. Eligible for $0 delivery fee and reduced service fees on qualifying orders.
          </Text>
        </ItemCard>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>Catering order</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            A large order for an event or group, typically scheduled in advance. May require special preparation and packaging.
          </Text>
        </ItemCard>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>Alcohol order</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Contains alcoholic beverages. Requires age verification (ID scan) at the door by the Dasher upon delivery.
          </Text>
        </ItemCard>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>Bundle order</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Items from multiple stores grouped into a single delivery trip. The Dasher picks up from more than one location.
          </Text>
        </ItemCard>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>First order</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            The customer's first-ever order on the platform. Often eligible for promotional pricing or free delivery.
          </Text>
        </ItemCard>
        <ItemCard>
          <Text textStyle={TextStyle.label.small.strong}>Batched order</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            The Dasher is picking up multiple separate orders from nearby merchants and delivering them in one trip. The merchant sees a banner indicating the order is batched.
          </Text>
          <ChipRow>
            <TypeChip>isBatched</TypeChip>
            <TypeChip>batchId</TypeChip>
          </ChipRow>
        </ItemCard>
      </ItemList>

      <SourceRef>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Source: <CodeChip>OrderType</CodeChip> enum, <CodeChip>GroupOrderType</CodeChip>, cart boolean flags
        </Text>
      </SourceRef>
    </DiagramContainer>
  );
}

// ============================================================================
// COMPATIBILITY MATRIX
// ============================================================================

type Compat = "yes" | "no" | "rare";

const COMPAT_LABELS = [
  "Group",
  "Gift",
  "Scheduled",
  "DashPass",
  "Catering",
  "Alcohol",
  "Bundle",
  "First order",
  "Batched",
];

const COMPAT_MATRIX: Compat[][] = (() => {
  const n = COMPAT_LABELS.length;
  const m: Compat[][] = Array.from({ length: n }, () => Array(n).fill("yes"));

  const set = (a: string, b: string, v: Compat) => {
    const i = COMPAT_LABELS.indexOf(a);
    const j = COMPAT_LABELS.indexOf(b);
    m[i][j] = v;
    m[j][i] = v;
  };

  set("Group", "Gift", "no");
  set("Group", "Bundle", "no");
  set("Group", "Catering", "rare");
  set("Gift", "Catering", "no");
  set("Gift", "Bundle", "no");
  set("Gift", "Alcohol", "no");
  set("Catering", "Bundle", "no");
  set("Bundle", "Batched", "no");

  return m;
})();

const COMPAT_COLORS = {
  yes: { bg: "#E8F5E9", text: "#2E7D32", symbol: "✓" },
  no: { bg: "#FFEBEE", text: "#C62828", symbol: "✗" },
  rare: { bg: "#FFF8E1", text: "#F57F17", symbol: "~" },
};

const MatrixWrapper = styled.div`
  overflow-x: auto;
  margin: 0 auto;
`;

const MatrixTable = styled.table`
  border-collapse: separate;
  border-spacing: 3px;
  margin: 0 auto;
  font-family: "DD-TTNorms", "TTNorms", -apple-system, BlinkMacSystemFont, sans-serif;
`;

const MatrixHeaderCell = styled.th`
  font-size: 11px;
  font-weight: 600;
  color: ${TextColor.text.default};
  white-space: nowrap;
  height: 84px;
  font-family: inherit;
  padding: 0;
  vertical-align: bottom;

  & > span {
    display: block;
    writing-mode: vertical-lr;
    transform: rotate(180deg);
    margin: 0 auto 6px;
  }
`;

const MatrixRowHeader = styled.td`
  padding: 6px 12px 6px 0;
  font-size: 11px;
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
  color: ${TextColor.text.default};
  font-family: inherit;
`;

const MatrixCell = styled.td<{ $type: Compat; $isSelf?: boolean }>`
  width: 36px;
  height: 32px;
  text-align: center;
  vertical-align: middle;
  font-size: 12px;
  font-weight: 600;
  border-radius: 5px;
  font-family: inherit;
  color: ${(p) => (p.$isSelf ? "transparent" : COMPAT_COLORS[p.$type].text)};
  background: ${(p) =>
    p.$isSelf
      ? Theme.usage.color.background.strong.default
      : COMPAT_COLORS[p.$type].bg};
`;

const LegendRow = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 24px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendDot = styled.span<{ $type: Compat }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${(p) => COMPAT_COLORS[p.$type].bg};
  color: ${(p) => COMPAT_COLORS[p.$type].text};
`;

const ExclusiveGroupsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.small};
  width: 100%;
  max-width: 560px;
`;

const ExclusiveGroupCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.small};
  padding: ${Spacing.medium};
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.background.default};
  border: 1.5px solid ${Theme.usage.color.border.default};
`;

const ExclusiveGroupLabel = styled.div`
  min-width: 100px;
`;

const ExclusiveChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
`;

const ExclusiveChip = styled.span<{ $disabled?: boolean }>`
  padding: 3px 10px;
  border-radius: ${Theme.usage.borderRadius.small};
  background: ${(p) => (p.$disabled ? Theme.usage.color.background.strong.default : "#FFEBEE")};
  color: ${(p) => (p.$disabled ? TextColor.text.subdued.default : "#C62828")};
  font-size: 11px;
  font-weight: 600;
  font-family: "DD-TTNorms", "TTNorms", -apple-system, BlinkMacSystemFont, sans-serif;
  opacity: ${(p) => (p.$disabled ? 0.6 : 1)};
  text-decoration: ${(p) => (p.$disabled ? "line-through" : "none")};
  cursor: ${(p) => (p.$disabled ? "default" : "inherit")};
`;

function CompatibilityDiagram() {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>Order type compatibility</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Which types can appear together on a single order
        </Text>
      </Node>

      <SectionTitle>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          MUTUALLY EXCLUSIVE GROUPS
        </Text>
      </SectionTitle>

      <ExclusiveGroupsWrapper>
        <ExclusiveGroupCard>
          <ExclusiveGroupLabel>
            <Text textStyle={TextStyle.label.small.strong}>Product line</Text>
          </ExclusiveGroupLabel>
          <ExclusiveChips>
            <ExclusiveChip>Marketplace</ExclusiveChip>
            <ExclusiveChip>Storefront</ExclusiveChip>
            <ExclusiveChip>Drive</ExclusiveChip>
            <ExclusiveChip>Grocery</ExclusiveChip>
            <ExclusiveChip>Catering</ExclusiveChip>
          </ExclusiveChips>
        </ExclusiveGroupCard>
        <ExclusiveGroupCard>
          <ExclusiveGroupLabel>
            <Text textStyle={TextStyle.label.small.strong}>Fulfillment</Text>
          </ExclusiveGroupLabel>
          <ExclusiveChips>
            <ExclusiveChip>Delivery</ExclusiveChip>
            <ExclusiveChip>Pickup</ExclusiveChip>
            <ExclusiveChip>Dine-in</ExclusiveChip>
            <Tooltip content="Shipping orders are not supported on the tablet app">
              {() => <ExclusiveChip $disabled>Shipping</ExclusiveChip>}
            </Tooltip>
          </ExclusiveChips>
        </ExclusiveGroupCard>
        <ExclusiveGroupCard>
          <ExclusiveGroupLabel>
            <Text textStyle={TextStyle.label.small.strong}>Timing</Text>
          </ExclusiveGroupLabel>
          <ExclusiveChips>
            <ExclusiveChip>ASAP</ExclusiveChip>
            <ExclusiveChip>Scheduled</ExclusiveChip>
          </ExclusiveChips>
        </ExclusiveGroupCard>
      </ExclusiveGroupsWrapper>

      <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default} style={{ marginTop: 8, maxWidth: 480, textAlign: "center" }}>
        An order belongs to exactly one option in each group above. These cannot be combined.
      </Text>

      <SectionTitle>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          ATTRIBUTE COMPATIBILITY MATRIX
        </Text>
      </SectionTitle>

      <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default} style={{ marginBottom: 16, maxWidth: 480, textAlign: "center" }}>
        Attributes are boolean flags — most can be combined, but some are incompatible or very rare together.
      </Text>

      <MatrixWrapper>
        <MatrixTable>
          <thead>
            <tr>
              <th />
              {COMPAT_LABELS.map((label) => (
                <MatrixHeaderCell key={label}><span>{label}</span></MatrixHeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPAT_LABELS.map((rowLabel, i) => (
              <tr key={rowLabel}>
                <MatrixRowHeader>{rowLabel}</MatrixRowHeader>
                {COMPAT_LABELS.map((colLabel, j) => {
                  const isSelf = i === j;
                  const type = COMPAT_MATRIX[i][j];
                  return (
                    <MatrixCell key={colLabel} $type={type} $isSelf={isSelf}>
                      {isSelf ? "·" : COMPAT_COLORS[type].symbol}
                    </MatrixCell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </MatrixTable>
      </MatrixWrapper>

      <LegendRow>
        <LegendItem>
          <LegendDot $type="yes">{COMPAT_COLORS.yes.symbol}</LegendDot>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Compatible
          </Text>
        </LegendItem>
        <LegendItem>
          <LegendDot $type="rare">{COMPAT_COLORS.rare.symbol}</LegendDot>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Rare / edge case
          </Text>
        </LegendItem>
        <LegendItem>
          <LegendDot $type="no">{COMPAT_COLORS.no.symbol}</LegendDot>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Incompatible
          </Text>
        </LegendItem>
      </LegendRow>

      <SourceRef>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Based on platform constraints and business rules
        </Text>
      </SourceRef>
    </DiagramContainer>
  );
}

function FlagsDiagram() {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>Order type detection</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          How each type is determined from the order data
        </Text>
      </Node>


      <ItemList>
        <ItemCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text textStyle={TextStyle.label.small.strong}>DashPass</Text>
            <CodeChip>dashPassInfo.isDashPassOrder</CodeChip>
          </div>
        </ItemCard>
        <ItemCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text textStyle={TextStyle.label.small.strong}>Gift</Text>
            <CodeChip>orderCart.isGift.value</CodeChip>
          </div>
        </ItemCard>
        <ItemCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text textStyle={TextStyle.label.small.strong}>Group</Text>
            <CodeChip>cart.groupCart</CodeChip>
          </div>
        </ItemCard>
        <ItemCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text textStyle={TextStyle.label.small.strong}>First order</Text>
            <CodeChip>cart.isFirstOrdercart</CodeChip>
          </div>
        </ItemCard>
        <ItemCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text textStyle={TextStyle.label.small.strong}>Marketplace</Text>
            <CodeChip>productLine === MARKETPLACE</CodeChip>
          </div>
        </ItemCard>
        <ItemCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text textStyle={TextStyle.label.small.strong}>Storefront</Text>
            <CodeChip>experience === STOREFRONT</CodeChip>
          </div>
        </ItemCard>
        <ItemCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text textStyle={TextStyle.label.small.strong}>Pickup</Text>
            <CodeChip>fulfillmentType === PICKUP</CodeChip>
          </div>
        </ItemCard>
        <ItemCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text textStyle={TextStyle.label.small.strong}>Grocery</Text>
            <CodeChip>orderTarget === GROCERY</CodeChip>
          </div>
        </ItemCard>
        <ItemCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text textStyle={TextStyle.label.small.strong}>Drive</Text>
            <CodeChip>productLine === EXTERNAL_CHECKOUT</CodeChip>
          </div>
        </ItemCard>
        <ItemCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text textStyle={TextStyle.label.small.strong}>Alcohol</Text>
            <CodeChip>alcoholOrderType !== NON_ALCOHOL</CodeChip>
          </div>
        </ItemCard>
        <ItemCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text textStyle={TextStyle.label.small.strong}>Batched</Text>
            <CodeChip>isBatched / batchId</CodeChip>
          </div>
        </ItemCard>
      </ItemList>

      <SourceRef>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Source: <CodeChip>Order.mapper.ts</CodeChip> in thq-bff
        </Text>
      </SourceRef>
    </DiagramContainer>
  );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export function OrderTypesDiagram() {
  const [activeTab, setActiveTab] = useState<FilterTab>("overview");
  const [activeBrand, setActiveBrand] = useState<Brand>("doordash");
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentBrand = brandOptions.find((b) => b.id === activeBrand)!;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBrandDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const brandDropdown = (
    <BrandDropdownWrapper ref={dropdownRef}>
      <BrandDropdownButton onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}>
        <currentBrand.logo />
        <Text textStyle={TextStyle.label.small.strong}>{currentBrand.label}</Text>
        <BrandDropdownChevron $isOpen={brandDropdownOpen}>▼</BrandDropdownChevron>
      </BrandDropdownButton>
      {brandDropdownOpen && (
        <BrandDropdownMenu>
          {brandOptions.map((opt) => (
            <BrandDropdownItem
              key={opt.id}
              $isActive={activeBrand === opt.id}
              onClick={() => {
                setActiveBrand(opt.id);
                setBrandDropdownOpen(false);
              }}
            >
              <opt.logo />
              <Text textStyle={TextStyle.label.small.default}>{opt.label}</Text>
            </BrandDropdownItem>
          ))}
        </BrandDropdownMenu>
      )}
    </BrandDropdownWrapper>
  );

  return (
    <Wrapper>
      {activeBrand === "doordash" ? (
        <>
          <TabRow>
            {brandDropdown}
            <TabDivider />
            {TABS.map((tab) => (
              <Tab
                key={tab.id}
                $active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <Text
                  textStyle={TextStyle.label.small.strong}
                  color={
                    activeTab === tab.id
                      ? TextColor.text.inverse.default
                      : TextColor.text.default
                  }
                >
                  {tab.label}
                </Text>
              </Tab>
            ))}
          </TabRow>

          {activeTab === "overview" && <OverviewDiagram />}
          {activeTab === "fulfillment" && <FulfillmentDiagram />}
          {activeTab === "attributes" && <AttributesDiagram />}
          {activeTab === "compatibility" && <CompatibilityDiagram />}
          {activeTab === "flags" && <FlagsDiagram />}
        </>
      ) : (
        <>
          <TabRow>
            {brandDropdown}
          </TabRow>
          <EmptyState>
            <Text
              textStyle={TextStyle.label.medium.default}
              color={TextColor.text.subdued.default}
            >
              Not documented yet
            </Text>
            <Text
              textStyle={TextStyle.body.small.default}
              color={TextColor.text.subdued.default}
            >
              Order types for {currentBrand.label} have not been documented.
            </Text>
          </EmptyState>
        </>
      )}
    </Wrapper>
  );
}
