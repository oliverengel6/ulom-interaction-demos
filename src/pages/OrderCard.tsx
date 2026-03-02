import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  Text,
  TextStyle,
  TextColor,
  Theme,
  IconColor,
  IconType,
  Spacing,
  Tooltip,
  Tag as PrismTag,
  TagType,
  TagSize,
} from "@doordash/prism-react";

// ============================================================================
// TYPES
// ============================================================================

type ProductLine = "marketplace" | "drive" | "grocery" | "catering" | "storefront";
type FulfillmentType = "delivery" | "pickup" | "dine_in";
type Timing = "asap" | "scheduled";
type CustomerType = "none" | "new_customer" | "top_customer";

interface OrderConfig {
  productLine: ProductLine;
  fulfillment: FulfillmentType;
  timing: Timing;
  customerType: CustomerType;
  attributes: Set<string>;
}

// ============================================================================
// OPTIONS DATA
// ============================================================================

const PRODUCT_LINES: { id: ProductLine; label: string; disabled?: boolean }[] = [
  { id: "marketplace", label: "Marketplace" },
  { id: "storefront", label: "Storefront" },
  { id: "drive", label: "Drive", disabled: true },
  { id: "grocery", label: "Grocery", disabled: true },
  { id: "catering", label: "Catering" },
];

const FULFILLMENT_TYPES: { id: FulfillmentType; label: string }[] = [
  { id: "delivery", label: "Delivery" },
  { id: "pickup", label: "Pickup" },
  { id: "dine_in", label: "Dine-in" },
];

const TIMING_OPTIONS: { id: Timing; label: string; disabled?: boolean }[] = [
  { id: "asap", label: "ASAP" },
  { id: "scheduled", label: "Scheduled", disabled: true },
];

const ATTRIBUTES: { id: string; label: string; disabled?: boolean; brand?: Brand }[] = [
  { id: "group", label: "Group" },
  { id: "gift", label: "Gift" },
  { id: "dashpass", label: "DashPass" },
  { id: "alcohol", label: "Alcohol" },
  { id: "batched", label: "Batched", disabled: true },
  { id: "cash", label: "Cash order", brand: "wolt" },
  { id: "large_order", label: "Large order", brand: "wolt" },
];

const CUSTOMER_TYPES: { id: CustomerType; label: string }[] = [
  { id: "none", label: "Default" },
  { id: "new_customer", label: "New customer" },
  { id: "top_customer", label: "Top customer" },
];

const FONT = `"DD-TTNorms", "TTNorms", -apple-system, BlinkMacSystemFont, sans-serif`;

// ============================================================================
// DEMO LAYOUT
// ============================================================================

const Wrapper = styled.div`
  width: 100%;
  padding: 0 0 40px;
`;

const Content = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;
`;

const ControlsPanel = styled.div`
  flex: 0 0 260px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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
      <linearGradient id="woltGradOrderCard" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#55C4F0" />
        <stop offset="100%" stopColor="#009DE0" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="5.3" fill="url(#woltGradOrderCard)" />
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


const PreviewPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding-top: 8px;
`;

// ============================================================================
// CONTROLS
// ============================================================================

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ControlLabel = styled.div`
  padding-left: 2px;
`;

const OptionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const OptionChip = styled.button<{ $active: boolean; $disabled?: boolean }>`
  all: unset;
  cursor: ${(p) => (p.$disabled ? "default" : "pointer")};
  padding: 4px 12px;
  border-radius: ${Theme.usage.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  font-family: ${FONT};
  transition: all 120ms ease;
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
  background: ${(p) =>
    p.$disabled
      ? Theme.usage.color.background.strong.default
      : p.$active
      ? Theme.usage.color.background.inverse.default
      : Theme.usage.color.background.strong.default};
  color: ${(p) =>
    p.$disabled
      ? TextColor.text.subdued.default
      : p.$active
      ? TextColor.text.inverse.default
      : TextColor.text.default};

  &:hover {
    background: ${(p) =>
      p.$disabled
        ? Theme.usage.color.background.strong.default
        : p.$active
        ? Theme.usage.color.background.inverse.default
        : Theme.usage.color.background.strong.hovered};
  }
`;

const ToggleChip = styled.button<{ $active: boolean; $disabled?: boolean }>`
  all: unset;
  cursor: ${(p) => (p.$disabled ? "default" : "pointer")};
  padding: 4px 12px;
  border-radius: ${Theme.usage.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  font-family: ${FONT};
  transition: all 120ms ease;
  border: 1.5px solid ${(p) =>
    p.$active ? "transparent" : Theme.usage.color.border.default};
  background: ${(p) =>
    p.$disabled
      ? "transparent"
      : p.$active
      ? Theme.usage.color.background.inverse.default
      : "transparent"};
  color: ${(p) =>
    p.$disabled
      ? TextColor.text.subdued.default
      : p.$active
      ? TextColor.text.inverse.default
      : TextColor.text.default};
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};

  &:hover {
    background: ${(p) =>
      p.$disabled
        ? "transparent"
        : p.$active
        ? Theme.usage.color.background.inverse.default
        : Theme.usage.color.background.strong.hovered};
  }
`;

// ============================================================================
// ORDER CARD — EYEBROW
// ============================================================================

const EYEBROW_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: "#006A25", text: "#FBFBFB" },
  scheduled: { bg: "#1537C7", text: "#FBFBFB" },
};

const BRAND_FONTS: Record<Brand, { family: string; weight: number }> = {
  doordash: { family: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`, weight: 700 },
  wolt: { family: `"Omnes", sans-serif`, weight: 700 },
  deliveroo: { family: `"Stratos", sans-serif`, weight: 700 },
};

const CardOuter = styled.div`
  width: 300px;
  height: 548px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.08);
  font-family: ${BRAND_FONTS.doordash.family};
  display: flex;
  flex-direction: column;
`;

const Eyebrow = styled.div<{ $bg: string }>`
  background: ${(p) => p.$bg};
  padding: 12px 22px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EyebrowText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #FBFBFB;
  letter-spacing: -0.01em;
`;

// ============================================================================
// ORDER CARD — CONTENT
// ============================================================================

const CardBody = styled.div`
  background: white;
  border-radius: 28px 28px 0 0;
  margin-top: -24px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
`;

const CardHeaderArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0 0;
  flex-shrink: 0;
  background: white;
  z-index: 1;
`;

const HeaderGradient = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: -32px;
  left: 0;
  right: 0;
  height: 32px;
  background: linear-gradient(to bottom, white 40%, transparent);
  pointer-events: none;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 150ms ease;
`;

const ScrollableItems = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  min-height: 42px;
`;

const CustomerNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

const CustomerName = styled.div<{ $fontFamily?: string; $fontWeight?: number }>`
  font-size: 24px;
  font-weight: ${(p) => p.$fontWeight || 700};
  color: #191919;
  letter-spacing: -0.01em;
  line-height: 24px;
  ${(p) => p.$fontFamily && `font-family: ${p.$fontFamily};`}
`;

const DashPassLogo = () => (
  <svg width="20" height="11" viewBox="0 0 20 11" fill="none" style={{ flexShrink: 0 }}>
    <path d="M0.466867 0.00544065C0.374275 0.00812015 0.284395 0.0448892 0.208069 0.100022C0.131744 0.155151 0.0722316 0.2323 0.0367074 0.322163C0.00118319 0.412026 -0.00883291 0.510768 0.00786539 0.606477C0.0245637 0.702186 0.0672624 0.790776 0.130814 0.861565L9.74666 10.9476C9.77127 10.9711 9.80125 10.9875 9.83367 10.9951C9.8661 11.0027 9.89986 11.0014 9.93165 10.9913C9.96344 10.9811 9.99218 10.9624 10.0151 10.9371C10.0379 10.9118 10.0541 10.8807 10.0621 10.8468L10.892 6.72589C10.8987 6.682 10.9206 6.64227 10.9535 6.61434C10.9865 6.58642 11.028 6.57226 11.0703 6.5746L14.4482 6.56315C14.731 6.57303 15.0064 6.46625 15.2153 6.26565C15.4242 6.06505 15.5501 5.78655 15.566 5.4897C15.5554 5.23299 15.4498 4.99077 15.2718 4.81454C15.0938 4.6383 14.8573 4.54194 14.6127 4.54594L10.9668 4.55739C10.9187 4.55879 10.8708 4.54994 10.826 4.53137C10.7812 4.51279 10.7405 4.48488 10.7062 4.44932L9.12882 2.79233C9.08702 2.75146 9.05805 2.6982 9.04577 2.63963C9.03349 2.58105 9.03848 2.51994 9.06007 2.46441C9.08166 2.40888 9.11883 2.36157 9.16664 2.32878C9.21445 2.29599 9.27062 2.28716 9.3277 2.28872H14.7642C15.1656 2.28872 15.5631 2.37179 15.934 2.53317C16.3049 2.69455 16.6419 2.93109 16.9258 3.22929C17.2097 3.52748 17.4349 3.88149 17.5885 4.2711C17.7421 4.66071 17.8212 5.07829 17.8212 5.5C17.8212 5.92171 17.7421 6.33929 17.5885 6.7289C17.4349 7.11851 17.2097 7.47252 16.9258 7.77071C16.6419 8.06891 16.3049 8.30545 15.934 8.46683C15.5631 8.62821 15.1656 8.71128 14.7642 8.71128V8.72072H12.6049C12.5161 8.72072 12.4394 8.78571 12.4205 8.87682L12.0309 10.7597C12.0053 10.8832 12.0949 11 12.2152 11H14.9057L14.9062 10.998C15.5453 10.9798 16.1763 10.8387 16.7678 10.5813C17.4031 10.3049 17.9803 9.89981 18.4665 9.38909C18.9526 8.87837 19.3383 8.27205 19.6014 7.60476C19.8646 6.93747 20 6.22227 20 5.5C20 4.77773 19.8646 4.06253 19.6014 3.39524C19.3805 2.83496 19.0732 2.31767 18.6925 1.86385L18.6294 1.79C18.5764 1.72908 18.5221 1.66937 18.4665 1.61091C17.9803 1.10019 17.4031 0.695064 16.7678 0.418664C16.2044 0.173502 15.6051 0.0338718 14.997 0.00544065L14.8032 0.000151213C14.7902 4.83882e-05 14.7772 0 14.7642 0L0.466867 0.00544065Z" fill="#00838A" />
  </svg>
);

const TimerButton = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${Theme.usage.color.background.strong.default};
  border: 1px solid ${Theme.usage.color.background.strong.default};
  border-radius: ${Theme.usage.borderRadius.full};
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 700;
  color: #191919;
  letter-spacing: -0.01em;
  line-height: 18px;
`;

const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M7 10l5-5 5 5" stroke="#191919" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 14l5 5 5-5" stroke="#191919" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// ORDER CARD — METADATA & TAGS
// ============================================================================

const MetadataSection = styled.div<{ $extraBottom?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 16px ${(p) => (p.$extraBottom ? "8px" : "0")};
`;

const MetaPrimary = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #181818;
  letter-spacing: -0.01em;
  line-height: 20px;
`;

const MetaSecondary = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #6C6C6C;
  letter-spacing: -0.01em;
  line-height: 18px;
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 16px 8px;
`;



// ============================================================================
// ORDER CARD — ITEM LIST
// ============================================================================


const GroupSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ItemsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 16px 0;
`;

const ItemRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const ItemQty = styled.div`
  width: 30px;
  height: 24px;
  border-radius: 6px;
  background: ${Theme.usage.color.background.strong.default};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  color: #191919;
  flex-shrink: 0;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding-top: 2px;
`;

const ItemNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const IconOnlyTag = styled.span`
  display: inline-flex;
  & > div {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
`;

const ItemName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #181818;
  letter-spacing: -0.01em;
  line-height: 18px;
`;

const ModifierName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #606060;
  letter-spacing: -0.01em;
  line-height: 18px;
`;

// ============================================================================
// ORDER CARD — FOOTER
// ============================================================================

const FooterWrapper = styled.div`
  position: relative;
  padding: 0 16px 16px;
  margin-top: 10px;
  flex-shrink: 0;
  background: white;
`;

const FooterGradient = styled.div`
  position: absolute;
  top: -32px;
  left: 0;
  right: 0;
  height: 32px;
  background: linear-gradient(to top, white 40%, transparent);
  pointer-events: none;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MoreButton = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${Theme.usage.borderRadius.full};
  background: ${Theme.usage.color.background.strong.default};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MoreDots = () => (
  <svg width="18" height="4" viewBox="0 0 18 4" fill="none">
    <circle cx="2" cy="2" r="1.5" fill="#191919" />
    <circle cx="9" cy="2" r="1.5" fill="#191919" />
    <circle cx="16" cy="2" r="1.5" fill="#191919" />
  </svg>
);

const ConfirmButton = styled.div`
  flex: 1;
  height: 48px;
  border-radius: ${Theme.usage.borderRadius.full};
  background: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  color: white;
  letter-spacing: -0.01em;
`;

// ============================================================================
// SAMPLE DATA
// ============================================================================

interface SampleItem {
  name: string;
  modifiers: string[];
  alcohol?: boolean;
}

interface GroupParticipant {
  name: string;
  items: SampleItem[];
}

const SAMPLE_ITEMS: SampleItem[] = [
  { name: "Spicy Chicken Sandwich", modifiers: ["Extra mayo", "No pickles"] },
  { name: "French Fries (Large)", modifiers: ["Add cheese sauce"] },
  { name: "Margarita", modifiers: [], alcohol: true },
];

const GROUP_PARTICIPANTS: GroupParticipant[] = [
  {
    name: "Emma E",
    items: [
      { name: "Spicy Chicken Sandwich", modifiers: ["Extra mayo", "No pickles"] },
      { name: "French Fries (Large)", modifiers: ["Add cheese sauce"] },
    ],
  },
  {
    name: "John D",
    items: [
      { name: "BBQ Bacon Burger", modifiers: ["No onions"] },
      { name: "Onion Rings", modifiers: [] },
    ],
  },
  {
    name: "Sarah M",
    items: [
      { name: "Caesar Salad", modifiers: ["Dressing on side"] },
      { name: "Iced Tea", modifiers: [] },
    ],
  },
];

// ============================================================================
// HELPERS
// ============================================================================

type TagPriority = 1 | 2 | 3 | 4;

interface TagData {
  label: string;
  icon: "info" | "group" | "gift" | "alcohol" | "phone" | "catering" | "person" | "trophy" | "cash" | "large_order";
  priority: TagPriority;
}

const TAG_ICON_MAP: Record<TagData["icon"], any> = {
  info: IconType.InfoCircleLine,
  group: IconType.PeopleGroupLine,
  gift: IconType.GiftLine,
  alcohol: IconType.AlcoholLine,
  phone: IconType.DevicePhone,
  catering: IconType.CateringLine,
  person: IconType.PersonUserLine,
  trophy: IconType.TrophyLine,
  cash: IconType.MoneyCashLine,
  large_order: IconType.OrderLargeLine,
};

function getTags(config: OrderConfig): TagData[] {
  const tags: TagData[] = [];

  // P1 — Compliance (requires legal/regulatory action)
  if (config.attributes.has("alcohol")) tags.push({ label: "Alcohol", icon: "alcohol", priority: 1 });

  // P2 — Customer signals (service prioritization)
  if (config.customerType === "top_customer") tags.push({ label: "Top customer", icon: "trophy", priority: 2 });
  if (config.customerType === "new_customer") tags.push({ label: "New customer", icon: "person", priority: 2 });

  // P3 — Channel / Source (fundamental order context)
  if (config.productLine === "storefront") tags.push({ label: "Online order", icon: "phone", priority: 3 });
  if (config.productLine === "drive") tags.push({ label: "Drive", icon: "info", priority: 3 });
  if (config.productLine === "grocery") tags.push({ label: "Grocery", icon: "info", priority: 3 });
  if (config.productLine === "catering") tags.push({ label: "Catering", icon: "catering", priority: 3 });

  // P4 — Order modifiers (preparation instructions)
  if (config.attributes.has("group")) tags.push({ label: "Group order", icon: "group", priority: 4 });
  if (config.attributes.has("gift")) tags.push({ label: "Gift", icon: "gift", priority: 4 });
  if (config.attributes.has("batched")) tags.push({ label: "Batched", icon: "info", priority: 4 });
  if (config.attributes.has("cash")) tags.push({ label: "Cash order", icon: "cash", priority: 4 });
  if (config.attributes.has("large_order")) tags.push({ label: "Large (5 bags)", icon: "large_order", priority: 4 });

  return tags;
}

function getEyebrowStatus(config: OrderConfig) {
  if (config.timing === "scheduled") return { label: "Scheduled", color: EYEBROW_COLORS.scheduled };
  return { label: "New", color: EYEBROW_COLORS.new };
}

function getFulfillmentLabel(config: OrderConfig): string {
  switch (config.fulfillment) {
    case "pickup": return "Customer pickup";
    case "dine_in": return "Dine-in";
    default: return "Delivery";
  }
}

function getConfirmLabel(config: OrderConfig): string {
  if (config.timing === "scheduled") return "Confirm";
  return "Confirm";
}

// ============================================================================
// TAG PRIORITY DIAGRAM
// ============================================================================

const DiagramSection = styled.div`
  width: 100%;
  max-width: 720px;
`;

const DiagramTitle = styled.div`
  margin-bottom: 24px;
`;

const PriorityRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const PriorityNumber = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${TextColor.text.subdued.default};
  flex-shrink: 0;
  font-family: ${FONT};
  line-height: 20px;
`;

const PriorityContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const PriorityTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

const ExampleSection = styled.div`
  margin-top: 32px;
  padding: 20px;
  border-radius: 12px;
  background: white;
  border: 1px solid ${IconColor.border.default};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ExampleTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
    <path d="M6 4l4 4-4 4" stroke="#191919" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PRIORITY_DATA: {
  priority: TagPriority;
  category: string;
  rationale: string;
  tags: { label: string; icon: TagData["icon"]; tagType: any }[];
}[] = [
  {
    priority: 1,
    category: "Compliance",
    rationale: "Requires legal or regulatory action. Must not be missed.",
    tags: [
      { label: "Alcohol", icon: "alcohol", tagType: TagType.negative },
    ],
  },
  {
    priority: 2,
    category: "Customer signals",
    rationale: "Helps prioritize service quality for the merchant.",
    tags: [
      { label: "Top customer", icon: "trophy", tagType: TagType.warning },
      { label: "New customer", icon: "person", tagType: TagType.informational },
    ],
  },
  {
    priority: 3,
    category: "Channel / Source",
    rationale: "Sets the fundamental context for how the order was placed.",
    tags: [
      { label: "Online order", icon: "phone", tagType: TagType.informational },
      { label: "Drive", icon: "info", tagType: TagType.informational },
      { label: "Catering", icon: "catering", tagType: TagType.informational },
      { label: "Grocery", icon: "info", tagType: TagType.informational },
    ],
  },
  {
    priority: 4,
    category: "Order modifiers",
    rationale: "Affects preparation and packaging of the order.",
    tags: [
      { label: "Group order", icon: "group", tagType: TagType.informational },
      { label: "Gift", icon: "gift", tagType: TagType.informational },
      { label: "Batched", icon: "info", tagType: TagType.informational },
    ],
  },
];

export function TagPriorityDiagram() {
  return (
    <DiagramSection>
      <DiagramTitle>
        <Text textStyle={TextStyle.label.medium.strong}>Tag priority order</Text>
        <div style={{ marginTop: 4 }}>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            When multiple tags appear on a card, they follow this left-to-right priority based on actionability.
          </Text>
        </div>
      </DiagramTitle>

      {PRIORITY_DATA.map((p) => (
        <PriorityRow key={p.priority}>
          <PriorityNumber>{p.priority}.</PriorityNumber>
          <PriorityContent>
            <Text textStyle={TextStyle.label.small.strong}>{p.category}</Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              {p.rationale}
            </Text>
            <PriorityTagRow>
              {p.tags.map((tag) => (
                <PrismTag
                  key={tag.label}
                  text={tag.label}
                  tagType={tag.tagType}
                  size={TagSize.small}
                  leadingIcon={{ type: TAG_ICON_MAP[tag.icon] }}
                />
              ))}
            </PriorityTagRow>
          </PriorityContent>
        </PriorityRow>
      ))}

      <ExampleSection>
        <Text textStyle={TextStyle.label.small.strong}>Example: Catering alcohol group order from a top customer</Text>
        <ExampleTagRow>
          <PrismTag text="Alcohol" tagType={TagType.negative} size={TagSize.small} leadingIcon={{ type: IconType.AlcoholLine }} />
          <ArrowIcon />
          <PrismTag text="Top customer" tagType={TagType.warning} size={TagSize.small} leadingIcon={{ type: IconType.TrophyLine }} />
          <ArrowIcon />
          <PrismTag text="Catering" tagType={TagType.informational} size={TagSize.small} leadingIcon={{ type: IconType.CateringLine }} />
          <ArrowIcon />
          <PrismTag text="Group order" tagType={TagType.informational} size={TagSize.small} leadingIcon={{ type: IconType.PeopleGroupLine }} />
        </ExampleTagRow>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          P1 Compliance → P2 Customer → P3 Channel → P4 Modifier
        </Text>
      </ExampleSection>
    </DiagramSection>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrderCardDemo() {
  const [config, setConfig] = useState<OrderConfig>({
    productLine: "marketplace",
    fulfillment: "delivery",
    timing: "asap",
    customerType: "none",
    attributes: new Set(),
  });

  const [activeBrand, setActiveBrand] = useState<Brand>("doordash");
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [headerGradientVisible, setHeaderGradientVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const handleScroll = () => {
    if (scrollRef.current) {
      setHeaderGradientVisible(scrollRef.current.scrollTop > 0);
    }
  };

  const toggleAttribute = (id: string) => {
    setConfig((prev) => {
      const next = new Set(prev.attributes);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, attributes: next };
    });
  };

  const tags = getTags(config);
  const isGroup = config.attributes.has("group");
  const isDashPass = config.attributes.has("dashpass");
  const isAlcohol = config.attributes.has("alcohol");
  const eyebrow = getEyebrowStatus(config);
  const fulfillmentLabel = getFulfillmentLabel(config);
  const confirmLabel = getConfirmLabel(config);

  return (
    <Wrapper>
      <Content>
        <ControlsPanel>
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

          <>
          <ControlGroup>
            <ControlLabel>
              <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
                PRODUCT LINE
              </Text>
            </ControlLabel>
            <OptionRow>
              {PRODUCT_LINES.map((opt) =>
                opt.disabled ? (
                  <Tooltip key={opt.id} title="Work in progress">
                    {() => (
                      <OptionChip $active={false} $disabled>
                        {opt.label}
                      </OptionChip>
                    )}
                  </Tooltip>
                ) : (
                  <OptionChip
                    key={opt.id}
                    $active={config.productLine === opt.id}
                    onClick={() => setConfig((p) => ({ ...p, productLine: opt.id }))}
                  >
                    {opt.label}
                  </OptionChip>
                )
              )}
            </OptionRow>
          </ControlGroup>

          <ControlGroup>
            <ControlLabel>
              <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
                FULFILLMENT
              </Text>
            </ControlLabel>
            <OptionRow>
              {FULFILLMENT_TYPES.map((opt) => (
                <OptionChip
                  key={opt.id}
                  $active={config.fulfillment === opt.id}
                  onClick={() => setConfig((p) => ({ ...p, fulfillment: opt.id }))}
                >
                  {opt.label}
                </OptionChip>
              ))}
            </OptionRow>
          </ControlGroup>

          <ControlGroup>
            <ControlLabel>
              <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
                TIMING
              </Text>
            </ControlLabel>
            <OptionRow>
              {TIMING_OPTIONS.map((opt) =>
                opt.disabled ? (
                  <Tooltip key={opt.id} title="Work in progress">
                    {() => (
                      <OptionChip $active={false} $disabled>
                        {opt.label}
                      </OptionChip>
                    )}
                  </Tooltip>
                ) : (
                  <OptionChip
                    key={opt.id}
                    $active={config.timing === opt.id}
                    onClick={() => setConfig((p) => ({ ...p, timing: opt.id }))}
                  >
                    {opt.label}
                  </OptionChip>
                )
              )}
            </OptionRow>
          </ControlGroup>

          <ControlGroup>
            <ControlLabel>
              <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
                ATTRIBUTES
              </Text>
            </ControlLabel>
            <OptionRow>
              {ATTRIBUTES.filter((attr) => !attr.brand || attr.brand === activeBrand).map((attr) =>
                attr.disabled ? (
                  <Tooltip key={attr.id} content="Work in progress">
                    {() => (
                      <ToggleChip $active={false} $disabled>
                        {attr.label}
                      </ToggleChip>
                    )}
                  </Tooltip>
                ) : (
                  <ToggleChip
                    key={attr.id}
                    $active={config.attributes.has(attr.id)}
                    onClick={() => toggleAttribute(attr.id)}
                  >
                    {attr.label}
                  </ToggleChip>
                )
              )}
            </OptionRow>
          </ControlGroup>

          <ControlGroup>
            <ControlLabel>
              <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
                CUSTOMER INFO
              </Text>
            </ControlLabel>
            <OptionRow>
              {CUSTOMER_TYPES.map((opt) => (
                <OptionChip
                  key={opt.id}
                  $active={config.customerType === opt.id}
                  onClick={() => setConfig((p) => ({ ...p, customerType: opt.id }))}
                >
                  {opt.label}
                </OptionChip>
              ))}
            </OptionRow>
          </ControlGroup>
          </>
        </ControlsPanel>

        <PreviewPanel>
          <CardOuter>
            {/* Eyebrow */}
            <Eyebrow $bg={eyebrow.color.bg}>
              <EyebrowText>{eyebrow.label}</EyebrowText>
              <EyebrowText>
                {activeBrand === "doordash" ? "#ABC123" : activeBrand === "wolt" ? "David C" : "David C"}
              </EyebrowText>
            </Eyebrow>

            {/* Body */}
            <CardBody>
              <CardHeaderArea>
                {/* Header: name/id + timer */}
                <CardHeader>
                  <CustomerNameRow>
                    <CustomerName $fontFamily={BRAND_FONTS[activeBrand].family} $fontWeight={BRAND_FONTS[activeBrand].weight}>
                      {activeBrand === "doordash" ? "David C" : activeBrand === "wolt" ? "#4821" : "#183"}
                    </CustomerName>
                    {isDashPass && <DashPassLogo />}
                  </CustomerNameRow>
                  <TimerButton>
                    20 min
                    <SortIcon />
                  </TimerButton>
                </CardHeader>

                <HeaderGradient $visible={headerGradientVisible} />
              </CardHeaderArea>

              <ScrollableItems ref={scrollRef} onScroll={handleScroll}>
                {/* Metadata: price, items, fulfillment */}
                <MetadataSection $extraBottom={tags.length === 0}>
                  <MetaPrimary>{isGroup
                    ? `${activeBrand === "wolt" ? "€48,00" : activeBrand === "deliveroo" ? "£44.00" : "$52.00"} · 6 items`
                    : `${activeBrand === "wolt" ? "€25,80" : activeBrand === "deliveroo" ? "£23.00" : "$28.00"} · 3 items`
                  }</MetaPrimary>
                  <MetaSecondary>{fulfillmentLabel}</MetaSecondary>
                </MetadataSection>

                {/* Tags */}
                {tags.length > 0 && (
                  <TagsRow>
                    {tags.map((tag) => (
                      <PrismTag
                        key={tag.label}
                        text={tag.label}
                        tagType={tag.icon === "alcohol" ? TagType.negative : tag.icon === "trophy" ? TagType.warning : TagType.informational}
                        size={TagSize.small}
                        leadingIcon={{ type: TAG_ICON_MAP[tag.icon] }}
                      />
                    ))}
                  </TagsRow>
                )}

                {/* Items */}
                <ItemsSection>
                {isGroup ? (
                  GROUP_PARTICIPANTS.map((participant, pi) => (
                    <GroupSection key={pi}>
                      <div style={{ alignSelf: "flex-start" }}>
                        <PrismTag
                          text={`${participant.name} (${pi + 1} of ${GROUP_PARTICIPANTS.length})`}
                          tagType={TagType.informational}
                          size={TagSize.small}
                          leadingIcon={{ type: IconType.PersonUserLine }}
                        />
                      </div>
                      {participant.items.map((item, i) => (
                        <ItemRow key={i}>
                          <ItemQty>1×</ItemQty>
                          <ItemDetails>
                            <ItemNameRow>
                              <ItemName>{item.name}</ItemName>
                              {isAlcohol && item.alcohol && (
                                <IconOnlyTag>
                                  <PrismTag text="" tagType={TagType.negative} size={TagSize.small} leadingIcon={{ type: IconType.AlcoholLine }} />
                                </IconOnlyTag>
                              )}
                            </ItemNameRow>
                            {item.modifiers.map((mod, j) => (
                              <ModifierName key={j}>{mod}</ModifierName>
                            ))}
                          </ItemDetails>
                        </ItemRow>
                      ))}
                    </GroupSection>
                  ))
                ) : (
                  SAMPLE_ITEMS.map((item, i) => (
                    <ItemRow key={i}>
                      <ItemQty>1×</ItemQty>
                      <ItemDetails>
                        <ItemNameRow>
                          <ItemName>{item.name}</ItemName>
                          {isAlcohol && item.alcohol && (
                            <IconOnlyTag>
                              <PrismTag text="" tagType={TagType.negative} size={TagSize.small} leadingIcon={{ type: IconType.AlcoholLine }} />
                            </IconOnlyTag>
                          )}
                        </ItemNameRow>
                        {item.modifiers.map((mod, j) => (
                          <ModifierName key={j}>{mod}</ModifierName>
                        ))}
                      </ItemDetails>
                    </ItemRow>
                  ))
                )}
              </ItemsSection>
              </ScrollableItems>

              {/* Footer */}
              <FooterWrapper>
                <FooterGradient />
                <FooterRow>
                  <MoreButton>
                    <MoreDots />
                  </MoreButton>
                  <ConfirmButton>{confirmLabel}</ConfirmButton>
                </FooterRow>
              </FooterWrapper>
            </CardBody>
          </CardOuter>
        </PreviewPanel>
      </Content>
    </Wrapper>
  );
}
