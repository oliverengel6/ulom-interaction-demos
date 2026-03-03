import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  Text,
  TextStyle,
  TextColor,
  Spacing,
  Theme,
  IconColor,
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
  align-items: center;
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
// DIAGRAM PRIMITIVES (matching OrderSorting style)
// ============================================================================

const DiagramContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
`;

const Node = styled.div<{ $variant?: "default" | "subtle" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: ${Spacing.small} ${Spacing.large};
  border-radius: ${Theme.usage.borderRadius.medium};
  text-align: center;
  min-width: 180px;
  background: ${(p) =>
    p.$variant === "subtle"
      ? Theme.usage.color.background.default
      : Theme.usage.color.background.strong.default};
  border: 1.5px solid
    ${(p) =>
      p.$variant === "subtle"
        ? Theme.usage.color.border.default
        : "transparent"};
`;

const Arrow = styled.div`
  width: 2px;
  height: 20px;
  background: #e9e9e9;
  position: relative;
  margin: 6px 0 10px;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid #e9e9e9;
  }
`;

const DecisionNode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: ${Spacing.small} ${Spacing.large};
  border-radius: ${Theme.usage.borderRadius.medium};
  text-align: center;
  min-width: 220px;
  background: #fff8e7;
  border: 1.5px solid #e8d5a3;
`;

const ForkStem = styled.div`
  width: 2px;
  height: 16px;
  background: #e9e9e9;
  margin: 6px 0 0;
`;

const ForkRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Spacing.large};
`;

const ForkBranch = styled.div<{ $position: "left" | "right" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    height: 2px;
    background: #e9e9e9;
    ${(p) =>
      p.$position === "left"
        ? `left: 50%; right: calc(-1 * ${Spacing.large} / 2);`
        : `left: calc(-1 * ${Spacing.large} / 2); right: 50%;`}
  }
`;

const BranchLabel = styled.div`
  padding: 3px 10px;
  border-radius: ${Theme.usage.borderRadius.full};
  background: ${Theme.usage.color.background.strong.default};
  position: relative;
  z-index: 1;
`;

const LabeledDrop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  height: 52px;
  position: relative;
  margin-bottom: 10px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: #e9e9e9;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid #e9e9e9;
  }
`;

const ResultNode = styled.div<{ $color?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: ${Spacing.small} ${Spacing.large};
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${(p) => p.$color || Theme.usage.color.background.inverse.default};
  text-align: center;
  min-width: 200px;
`;


const StepLabel = styled.div`
  margin: 4px 0;
`;

const SourceRef = styled.div`
  margin-top: ${Spacing.large};
  text-align: center;
`;

const CodeChip = styled.code`
  background: ${Theme.usage.color.background.strong.default};
  padding: 1px 6px;
  border-radius: ${Theme.usage.borderRadius.small};
  font-size: 11px;
`;



// ============================================================================
// TAB CONTENT
// ============================================================================

type ViewTab = "overview" | "not_paid_reasons" | "sources" | "issue_with_order";

function OverviewDiagram() {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>Order is canceled</Text>
        <Text
          textStyle={TextStyle.body.small.default}
          color={TextColor.text.subdued.default}
        >
          By customer, merchant, Dasher, or system
        </Text>
      </Node>
      <Arrow />

      <DecisionNode>
        <Text textStyle={TextStyle.label.small.strong}>
          Did merchant confirm the order?
        </Text>
        <Text
          textStyle={TextStyle.body.small.default}
          color={TextColor.text.subdued.default}
        >
          Was it accepted before cancellation?
        </Text>
      </DecisionNode>
      <ForkStem />

      <ForkRow>
        <ForkBranch $position="left">
          <LabeledDrop>
            <BranchLabel>
              <Text
                textStyle={TextStyle.label.small.strong}
                color={TextColor.text.subdued.default}
              >
                YES
              </Text>
            </BranchLabel>
          </LabeledDrop>

          <DecisionNode>
            <Text textStyle={TextStyle.label.small.strong}>
              Merchant at fault?
            </Text>
            <Text
              textStyle={TextStyle.body.small.default}
              color={TextColor.text.subdued.default}
            >
              See "Not Paid Reasons" tab
            </Text>
          </DecisionNode>
          <ForkStem />

          <ForkRow>
            <ForkBranch $position="left">
              <LabeledDrop>
                <BranchLabel>
                  <Text
                    textStyle={TextStyle.label.small.strong}
                    color={TextColor.text.subdued.default}
                  >
                    NO
                  </Text>
                </BranchLabel>
              </LabeledDrop>
              <ResultNode $color="#006a25">
                <Text
                  textStyle={TextStyle.label.small.strong}
                  color={TextColor.text.inverse.default}
                >
                  Cancelled — Paid
                </Text>
                <Text
                  textStyle={TextStyle.body.small.default}
                  color={TextColor.text.inverse.default}
                  style={{ opacity: 0.7 }}
                >
                  Merchant receives payout
                </Text>
              </ResultNode>
            </ForkBranch>
            <ForkBranch $position="right">
              <LabeledDrop>
                <BranchLabel>
                  <Text
                    textStyle={TextStyle.label.small.strong}
                    color={TextColor.text.subdued.default}
                  >
                    YES
                  </Text>
                </BranchLabel>
              </LabeledDrop>
              <ResultNode $color="#B71000">
                <Text
                  textStyle={TextStyle.label.small.strong}
                  color={TextColor.text.inverse.default}
                >
                  Cancelled — Not Paid
                </Text>
                <Text
                  textStyle={TextStyle.body.small.default}
                  color={TextColor.text.inverse.default}
                  style={{ opacity: 0.7 }}
                >
                  No payout to merchant
                </Text>
              </ResultNode>
            </ForkBranch>
          </ForkRow>
        </ForkBranch>

        <ForkBranch $position="right">
          <LabeledDrop>
            <BranchLabel>
              <Text
                textStyle={TextStyle.label.small.strong}
                color={TextColor.text.subdued.default}
              >
                NO
              </Text>
            </BranchLabel>
          </LabeledDrop>
          <ResultNode $color="#B71000">
            <Text
              textStyle={TextStyle.label.small.strong}
              color={TextColor.text.inverse.default}
            >
              Cancelled — Not Paid
            </Text>
            <Text
              textStyle={TextStyle.body.small.default}
              color={TextColor.text.inverse.default}
              style={{ opacity: 0.7 }}
            >
              No payout to merchant
            </Text>
          </ResultNode>
        </ForkBranch>
      </ForkRow>
    </DiagramContainer>
  );
}

const NOT_PAID_REASONS: {
  label: string;
  description: string;
}[] = [
  { label: "Store closed", description: "Store was closed when the order came in" },
  { label: "Item out of stock", description: "One or more items were unavailable" },
  { label: "Could not fulfill", description: "Store accepted but couldn't complete the order" },
  { label: "Merchant did not confirm", description: "Order timed out waiting for merchant confirmation" },
  { label: "Merchant unresponsive", description: "No response from merchant after repeated attempts" },
  { label: "Staff requested cancel", description: "Store staff explicitly asked to cancel" },
  { label: "Staff too busy", description: "Store unable to take the order due to high volume" },
  { label: "Order not prepared", description: "Dasher arrived but food was not ready or never made" },
  { label: "Wrong order to Dasher", description: "Incorrect order was handed to the Dasher" },
  { label: "Long fulfillment time", description: "Prep time exceeded acceptable threshold" },
  { label: "Duplicate order", description: "Same order was placed more than once" },
  { label: "Extreme Dasher wait", description: "Dasher waited too long for the order to be ready" },
  { label: "Unable to place order", description: "Order could not be transmitted to the store" },
  { label: "Order not placed by staff", description: "Phone/manual order that staff did not enter into POS" },
];

const ReasonList = styled.div`
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: ${Spacing.xSmall};
`;

const ReasonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px ${Spacing.small};
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.background.default};
  border: 1.5px solid ${Theme.usage.color.border.default};
`;

function NotPaidReasonsDiagram() {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>
          Order cancelled — not paid
        </Text>
        <Text
          textStyle={TextStyle.body.small.default}
          color={TextColor.text.subdued.default}
        >
          Merchant does not receive payout
        </Text>
      </Node>
      <Arrow />

      <StepLabel>
        <Text
          textStyle={TextStyle.label.small.default}
          color={TextColor.text.subdued.default}
        >
          CANCELLATION REASONS
        </Text>
      </StepLabel>
      <Arrow />

      <ReasonList>
        {NOT_PAID_REASONS.map((reason) => (
          <ReasonRow key={reason.label}>
            <Text textStyle={TextStyle.label.small.strong}>
              {reason.label}
            </Text>
            <Text
              textStyle={TextStyle.body.small.default}
              color={TextColor.text.subdued.default}
            >
              {reason.description}
            </Text>
          </ReasonRow>
        ))}
      </ReasonList>
    </DiagramContainer>
  );
}

const SOURCE_GROUPS: {
  label: string;
  sources: { label: string; description: string }[];
}[] = [
  {
    label: "Customer",
    sources: [
      { label: "Consumer self-serve", description: "Customer cancels in-app" },
      { label: "Cx support", description: "Customer support agent cancels on behalf of customer" },
    ],
  },
  {
    label: "Merchant",
    sources: [
      { label: "Merchant tablet", description: "Canceled from KDS / tablet" },
      { label: "Merchant app", description: "Business Manager app" },
      { label: "Mx support", description: "Merchant support agent cancels on behalf of merchant" },
      { label: "Retail merchant", description: "Retail / grocery merchant cancels" },
    ],
  },
  {
    label: "Dasher",
    sources: [
      { label: "Dasher", description: "Dasher cancels the delivery" },
      { label: "Retail Dasher / Shopper", description: "Shop & deliver cancel" },
      { label: "Dx support", description: "Dasher support agent cancels on behalf of Dasher" },
    ],
  },
  {
    label: "System",
    sources: [
      { label: "Proactive", description: "DoorDash auto-cancels the order" },
      { label: "Bulk cancellation", description: "Mass cancel by ops (e.g. outages)" },
      { label: "Proactive gift", description: "Automatic gift order cancellation" },
    ],
  },
];

const SourceGroupRow = styled.div`
  display: flex;
  gap: ${Spacing.small};
  align-items: stretch;
  width: 100%;
  max-width: 680px;
`;

const SourceBucket = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.xSmall};
  padding: ${Spacing.small};
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.background.default};
  border: 1.5px solid ${Theme.usage.color.border.default};
  flex: 1;
  min-width: 0;
`;

const SourceItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 6px ${Spacing.xSmall};
  border-radius: ${Theme.usage.borderRadius.small};
  background: ${Theme.usage.color.background.strong.default};
`;

function SourcesDiagram() {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>
          Who can cancel an order?
        </Text>
        <Text
          textStyle={TextStyle.body.small.default}
          color={TextColor.text.subdued.default}
        >
          OrderCancellationSourceType
        </Text>
      </Node>
      <Arrow />

      <StepLabel>
        <Text
          textStyle={TextStyle.label.small.default}
          color={TextColor.text.subdued.default}
        >
          CANCELLATION SOURCES
        </Text>
      </StepLabel>
      <Arrow />

      <SourceGroupRow>
        {SOURCE_GROUPS.map((group) => (
          <SourceBucket key={group.label}>
            <Text
              textStyle={TextStyle.label.small.strong}
              style={{ textAlign: "center", paddingBottom: 2 }}
            >
              {group.label}
            </Text>
            {group.sources.map((source) => (
              <SourceItem key={source.label}>
                <Text textStyle={TextStyle.label.small.strong} style={{ fontSize: 11 }}>
                  {source.label}
                </Text>
                <Text
                  textStyle={TextStyle.body.small.default}
                  color={TextColor.text.subdued.default}
                  style={{ fontSize: 10, lineHeight: "14px" }}
                >
                  {source.description}
                </Text>
              </SourceItem>
            ))}
          </SourceBucket>
        ))}
      </SourceGroupRow>
    </DiagramContainer>
  );
}

// ============================================================================
// ISSUE WITH ORDER TAB
// ============================================================================

const SectionTitle = styled.div`
  margin: 32px 0 16px;
  text-align: center;
`;

const EntryPointFlow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const EntryPointStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.background.strong.default};
  text-align: center;
  min-width: 140px;
`;

const EntryArrow = styled.div`
  font-size: 18px;
  color: #ccc;
`;

const MatrixWrapper = styled.div`
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
`;

const MatrixSection = styled.div`
  margin-bottom: 24px;
`;

const MatrixHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: ${Theme.usage.borderRadius.medium} ${Theme.usage.borderRadius.medium} 0 0;
  background: ${Theme.usage.color.background.inverse.default};
`;

const MatrixBody = styled.div`
  border: 1.5px solid ${Theme.usage.color.border.default};
  border-top: none;
  border-radius: 0 0 ${Theme.usage.borderRadius.medium} ${Theme.usage.borderRadius.medium};
  overflow: hidden;
`;

const MatrixRow = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: stretch;
  background: ${(p) => (p.$even ? Theme.usage.color.background.strong.default : "#fff")};
  border-bottom: 1px solid ${Theme.usage.color.border.default};

  &:last-child {
    border-bottom: none;
  }
`;

const MatrixStatusCell = styled.div`
  width: 200px;
  flex-shrink: 0;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  border-right: 1px solid ${Theme.usage.color.border.default};
`;

const MatrixActionsCell = styled.div`
  flex: 1;
  padding: 8px 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

const ActionChip = styled.div<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: ${Theme.usage.borderRadius.full};
  background: ${(p) => p.$color || Theme.usage.color.background.strong.default};
  white-space: nowrap;
`;

const CancelFlowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  max-width: 400px;
  margin: 0 auto;
`;

const ModalMock = styled.div`
  width: 100%;
  max-width: 380px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  background: #fff;
`;

const ModalBody = styled.div`
  padding: 24px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
`;

const ModalActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 24px 24px;
`;

const ModalBtn = styled.div<{ $destructive?: boolean }>`
  padding: 12px;
  border-radius: 9999px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  background: ${(p) => (p.$destructive ? "#B71000" : "#f1f1f1")};
  color: ${(p) => (p.$destructive ? "#fff" : "#181818")};
`;

const SubflowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
`;

const SubflowCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.background.default};
  border: 1.5px solid ${Theme.usage.color.border.default};
`;

const SubflowIcon = styled.div`
  font-size: 18px;
  line-height: 1;
`;

const LiveCalloutBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: ${Theme.usage.borderRadius.medium};
  background: #eef6ff;
  border: 1.5px solid #c4ddf6;
  max-width: 780px;
  margin: 0 auto 16px;
`;

const DRIVE_MATRIX: { status: string; description: string; actions: { label: string; color?: string }[] }[] = [
  {
    status: "Scheduled",
    description: "Order placed, not yet active",
    actions: [
      { label: "Reschedule" },
      { label: "Item Out of Stock" },
      { label: "Cancel Order", color: "#fde8e8" },
      { label: "Get Help" },
    ],
  },
  {
    status: "En route to store",
    description: "Dasher heading to merchant",
    actions: [
      { label: "Item Out of Stock" },
      { label: "Cancel Order", color: "#fde8e8" },
      { label: "Get Help" },
    ],
  },
  {
    status: "Arrived at store",
    description: "Dasher is at the merchant",
    actions: [
      { label: "Item Out of Stock" },
      { label: "Cancel Order", color: "#fde8e8" },
      { label: "Get Help" },
    ],
  },
  {
    status: "En route to consumer",
    description: "Dasher delivering to customer",
    actions: [{ label: "Get Help" }],
  },
  {
    status: "Arrived at consumer",
    description: "Dasher at customer location",
    actions: [{ label: "Get Help" }],
  },
  {
    status: "Returning to store",
    description: "Dasher returning order",
    actions: [{ label: "Get Help" }],
  },
  {
    status: "Delivered / Abandoned / Returned",
    description: "Completed states",
    actions: [{ label: "Rate Dasher" }, { label: "Get Help" }],
  },
  {
    status: "Cancelled",
    description: "Already cancelled",
    actions: [{ label: "Get Help" }],
  },
];

const MARKETPLACE_MATRIX: { status: string; description: string; actions: { label: string; color?: string }[] }[] = [
  {
    status: "Before pickup",
    description: "Order not yet picked up",
    actions: [
      { label: "Get Help" },
      { label: "Order Adjustments" },
      { label: "Item Out of Stock" },
    ],
  },
  {
    status: "After pickup",
    description: "Dasher has the order",
    actions: [{ label: "Get Help" }],
  },
  {
    status: "With error charges",
    description: "Cancellation charge applied",
    actions: [{ label: "Dispute Charge" }],
  },
  {
    status: "Dasher assigned",
    description: "Any state with a dasher",
    actions: [{ label: "Rate Dasher" }],
  },
];

const STOREFRONT_MATRIX: { status: string; description: string; actions: { label: string; color?: string }[] }[] = [
  {
    status: "Active order",
    description: "Order is in progress",
    actions: [{ label: "Support Form" }, { label: "Get Help" }],
  },
  {
    status: "Refund eligible",
    description: "Qualifies for merchant-initiated refund",
    actions: [
      { label: "Issue Refund" },
      { label: "Support Form" },
      { label: "Get Help" },
    ],
  },
  {
    status: "Dasher delivery",
    description: "Fulfilled by Dasher",
    actions: [{ label: "Rate Dasher" }, { label: "Support Form" }, { label: "Get Help" }],
  },
];

const SUBFLOWS: { icon: string; label: string; description: string }[] = [
  { icon: "🚫", label: "Item Out of Stock", description: "Mark specific items as unavailable. Triggers substitution or partial refund flow." },
  { icon: "💬", label: "Get Help", description: "Opens the Help bottom sheet with contextual support options for the current order." },
  { icon: "📅", label: "Reschedule", description: "Change the scheduled delivery time. Only available for Drive scheduled orders." },
  { icon: "⭐", label: "Rate Dasher", description: "Leave feedback on Dasher performance after delivery or if order was abandoned." },
  { icon: "⚖️", label: "Dispute Charge", description: "Challenge an error charge on a cancelled DD/Caviar order with self-delivery." },
  { icon: "💸", label: "Issue / Request Refund", description: "Merchant-initiated refund for Storefront or Drive orders when eligible." },
  { icon: "📝", label: "Order Adjustments", description: "Modify item quantities or mark items out of stock before pickup (BMA feature)." },
  { icon: "📞", label: "Call / Chat", description: "Call customer or Dasher, or open support chat. Shown at the top of the sheet for all live orders." },
];

function ActionMatrix({
  title,
  rows,
}: {
  title: string;
  rows: { status: string; description: string; actions: { label: string; color?: string }[] }[];
}) {
  return (
    <MatrixSection>
      <MatrixHeader>
        <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.inverse.default}>
          {title}
        </Text>
      </MatrixHeader>
      <MatrixBody>
        {rows.map((row, i) => (
          <MatrixRow key={row.status} $even={i % 2 === 1}>
            <MatrixStatusCell>
              <Text textStyle={TextStyle.label.small.strong} style={{ fontSize: 12 }}>
                {row.status}
              </Text>
              <Text
                textStyle={TextStyle.body.small.default}
                color={TextColor.text.subdued.default}
                style={{ fontSize: 11 }}
              >
                {row.description}
              </Text>
            </MatrixStatusCell>
            <MatrixActionsCell>
              {row.actions.map((action) => (
                <ActionChip key={action.label} $color={action.color}>
                  <Text textStyle={TextStyle.label.small.default} style={{ fontSize: 11 }}>
                    {action.label}
                  </Text>
                </ActionChip>
              ))}
            </MatrixActionsCell>
          </MatrixRow>
        ))}
      </MatrixBody>
    </MatrixSection>
  );
}

function IssueWithOrderDiagram() {
  return (
    <DiagramContainer>
      {/* Entry point */}
      <SectionTitle>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          ENTRY POINT
        </Text>
      </SectionTitle>

      <EntryPointFlow>
        <EntryPointStep>
          <Text textStyle={TextStyle.label.small.strong}>Order Details</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Tap on any order card
          </Text>
        </EntryPointStep>
        <EntryArrow>→</EntryArrow>
        <EntryPointStep>
          <Text textStyle={TextStyle.label.small.strong}>⋮ More button</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Three-dot icon in header
          </Text>
        </EntryPointStep>
        <EntryArrow>→</EntryArrow>
        <EntryPointStep style={{ background: Theme.usage.color.background.inverse.default }}>
          <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.inverse.default}>
            Order Action Sheet
          </Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.inverse.default} style={{ opacity: 0.7 }}>
            Bottom sheet with actions
          </Text>
        </EntryPointStep>
      </EntryPointFlow>

      {/* Call/Chat callout */}
      <SectionTitle>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          AVAILABLE ACTIONS BY ORDER STATE
        </Text>
      </SectionTitle>

      <LiveCalloutBar>
        <Text textStyle={TextStyle.body.small.default} style={{ fontSize: 16 }}>📞</Text>
        <div>
          <Text textStyle={TextStyle.label.small.strong} style={{ fontSize: 12 }}>
            Call / Chat actions
          </Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default} style={{ fontSize: 11 }}>
            Shown at the top of the action sheet for all live orders (Scheduled through Returning to Store)
          </Text>
        </div>
      </LiveCalloutBar>

      {/* Matrix tables */}
      <MatrixWrapper>
        <ActionMatrix title="Drive Orders" rows={DRIVE_MATRIX} />
        <ActionMatrix title="DD / Caviar (Marketplace) Orders" rows={MARKETPLACE_MATRIX} />
        <ActionMatrix title="Storefront Orders" rows={STOREFRONT_MATRIX} />
      </MatrixWrapper>

      {/* Cancel subflow */}
      <SectionTitle>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          CANCEL ORDER SUBFLOW
        </Text>
      </SectionTitle>

      <CancelFlowWrapper>
        <Node>
          <Text textStyle={TextStyle.label.small.strong}>Merchant taps "Cancel order"</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Drive orders only — before pickup
          </Text>
        </Node>
        <Arrow />

        <ModalMock>
          <ModalBody>
            <Text textStyle={TextStyle.label.small.strong}>Cancel order</Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              Are you sure you want to cancel{" "}
              <strong>Emma E</strong>'s order?
            </Text>
          </ModalBody>
          <ModalActions>
            <ModalBtn $destructive>Yes, cancel</ModalBtn>
            <ModalBtn>No, don't cancel</ModalBtn>
          </ModalActions>
        </ModalMock>

        <Arrow />
        <Node $variant="subtle">
          <Text textStyle={TextStyle.label.small.strong}>API call</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            PUT api/v1/delivery/&#123;deliveryUuid&#125;
          </Text>
        </Node>
        <Arrow />
        <div style={{ display: "flex", gap: 12 }}>
          <ResultNode $color="#B71000">
            <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.inverse.default}>
              Order cancelled
            </Text>
            <Text
              textStyle={TextStyle.body.small.default}
              color={TextColor.text.inverse.default}
              style={{ opacity: 0.7 }}
            >
              No reason selection — backend assigns default
            </Text>
          </ResultNode>
        </div>
      </CancelFlowWrapper>

      <SourceRef style={{ marginTop: 16, marginBottom: 0 }}>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Source: <CodeChip>CancelOrder.tsx</CodeChip> modal,{" "}
          <CodeChip>driveUtils.ts</CodeChip> /{" "}
          <CodeChip>marketplaceUtils.ts</CodeChip>
        </Text>
      </SourceRef>

      {/* Other subflows */}
      <SectionTitle>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          OTHER ACTION SHEET OPTIONS
        </Text>
      </SectionTitle>

      <SubflowGrid>
        {SUBFLOWS.map((sf) => (
          <SubflowCard key={sf.label}>
            <SubflowIcon>{sf.icon}</SubflowIcon>
            <Text textStyle={TextStyle.label.small.strong}>{sf.label}</Text>
            <Text
              textStyle={TextStyle.body.small.default}
              color={TextColor.text.subdued.default}
              style={{ fontSize: 12 }}
            >
              {sf.description}
            </Text>
          </SubflowCard>
        ))}
      </SubflowGrid>
    </DiagramContainer>
  );
}

// ============================================================================
// BRAND SWITCHER
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
      <linearGradient id="woltGradCanceled" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#55C4F0" />
        <stop offset="100%" stopColor="#009DE0" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="5.3" fill="url(#woltGradCanceled)" />
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
  gap: ${Spacing.xSmall};
  padding: ${Spacing.xLarge};
  min-height: 200px;
`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const tabs: { id: ViewTab; label: string }[] = [
  { id: "overview", label: "Payment Policy" },
  { id: "not_paid_reasons", label: "Not Paid Reasons" },
  { id: "sources", label: "Cancellation Sources" },
  { id: "issue_with_order", label: "Issue with Order" },
];

export function CanceledOrdersDiagram() {
  const [activeTab, setActiveTab] = useState<ViewTab>("overview");
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
            {tabs.map((tab) => (
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
          {activeTab === "not_paid_reasons" && <NotPaidReasonsDiagram />}
          {activeTab === "sources" && <SourcesDiagram />}
          {activeTab === "issue_with_order" && <IssueWithOrderDiagram />}

          <SourceRef>
            <Text
              textStyle={TextStyle.body.small.default}
              color={TextColor.text.subdued.default}
            >
              Source: <CodeChip>CancellationReasons</CodeChip> enum &{" "}
              <CodeChip>OrderCancellationSourceType</CodeChip> in{" "}
              <CodeChip>orderDetails/types.ts</CodeChip>
            </Text>
          </SourceRef>
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
              Not available yet
            </Text>
            <Text
              textStyle={TextStyle.body.small.default}
              color={TextColor.text.subdued.default}
            >
              Canceled order policy for {currentBrand.label} has not been documented.
            </Text>
          </EmptyState>
        </>
      )}
    </Wrapper>
  );
}
