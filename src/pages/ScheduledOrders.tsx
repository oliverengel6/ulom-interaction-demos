import { useState } from "react";
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
// DIAGRAM PRIMITIVES
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

const AccentNode = styled.div<{ $bg: string; $border: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: ${Spacing.small} ${Spacing.large};
  border-radius: ${Theme.usage.borderRadius.medium};
  text-align: center;
  min-width: 200px;
  background: ${(p) => p.$bg};
  border: 1.5px solid ${(p) => p.$border};
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

const NotificationBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: ${Theme.usage.borderRadius.full};
  background: #fef3e0;
  border: 1.5px dashed #e0a830;
  text-align: center;
  margin: -2px 0;
`;

const BellIcon = styled.span`
  font-size: 13px;
  line-height: 1;
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

const MergeForkRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: ${Spacing.large};
`;

const MergeForkBranch = styled.div<{ $position: "left" | "right" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;

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

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #e9e9e9;
    ${(p) =>
      p.$position === "left"
        ? `left: 50%; right: calc(-1 * ${Spacing.large} / 2);`
        : `left: calc(-1 * ${Spacing.large} / 2); right: 50%;`}
  }
`;

const BranchBottomStem = styled.div`
  width: 2px;
  flex: 1;
  min-height: 16px;
  background: #e9e9e9;
  margin-top: 6px;
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

// (Comparison table styled components removed — tab no longer used)

// ============================================================================
// TIMELINE
// ============================================================================

const TimelineWrapper = styled.div`
  width: 100%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TimelineStep = styled.div`
  display: flex;
  gap: ${Spacing.medium};
  align-items: stretch;
  min-height: 56px;
`;

const TimelineNumberTrack = styled.div<{ $isFirst?: boolean; $isLast?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  flex-shrink: 0;

  &::before {
    content: "";
    width: 2px;
    height: 4px;
    background: ${(p) => (p.$isFirst ? "transparent" : "#e9e9e9")};
    margin-bottom: 4px;
  }

  &::after {
    content: "";
    width: 2px;
    flex: 1;
    background: ${(p) => (p.$isLast ? "transparent" : "#e9e9e9")};
    margin-top: 4px;
  }
`;

const TimelineNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${Theme.usage.color.background.strong.default};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: "TT Norms", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: ${TextColor.text.subdued.default};
`;

const TimelineContent = styled.div`
  flex: 1;
  padding-top: 10px;
  padding-bottom: ${Spacing.medium};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PathwayRow = styled.div`
  display: flex;
  gap: ${Spacing.small};
  margin-top: 8px;
`;

const PathwayCard = styled.div<{ $accent: string }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.background.strong.default};
  border-top: 2.5px solid ${(p) => p.$accent};
`;

const PathwayNotification = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: ${Theme.usage.borderRadius.full};
  background: #fef3e0;
  border: 1px dashed #e0a830;
  align-self: flex-start;
`;


// ============================================================================
// TAB CONTENT
// ============================================================================

type ViewTab = "lifecycle" | "visibility" | "designs";

function LifecycleDiagram() {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>Customer places order</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Selects a future delivery / pickup time
        </Text>
      </Node>
      <Arrow />

      <AccentNode $bg="#f3f3f3" $border="#d4d4d4">
        <Text textStyle={TextStyle.label.small.strong}>Order enters "Scheduled" state</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Dark gray eyebrow on KDS card
        </Text>
      </AccentNode>
      <Arrow />

      <NotificationBox>
        <BellIcon>🔔</BellIcon>
        <Text textStyle={TextStyle.label.small.default}>"New scheduled order"</Text>
      </NotificationBox>
      <Arrow />

      <DecisionNode>
        <Text textStyle={TextStyle.label.small.strong}>
          Is it time to start preparation?
        </Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Based on estimated prep time before the scheduled pickup
        </Text>
      </DecisionNode>
      <ForkStem />

      <ForkRow>
        <ForkBranch $position="left">
          <LabeledDrop>
            <BranchLabel>
              <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>
                NOT YET
              </Text>
            </BranchLabel>
          </LabeledDrop>
          <Node>
            <Text textStyle={TextStyle.label.small.strong}>Remains scheduled</Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              Visible but not actionable yet
            </Text>
          </Node>
        </ForkBranch>

        <ForkBranch $position="right">
          <LabeledDrop>
            <BranchLabel>
              <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>
                YES
              </Text>
            </BranchLabel>
          </LabeledDrop>
          <ForkStem />
          <MergeForkRow>
            <MergeForkBranch $position="left">
              <LabeledDrop>
                <BranchLabel>
                  <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>
                    MANUAL ACCEPT
                  </Text>
                </BranchLabel>
              </LabeledDrop>
              <NotificationBox>
                <BellIcon>🔔</BellIcon>
                <Text textStyle={TextStyle.label.small.default}>"Scheduled order needs prep"</Text>
              </NotificationBox>
              <Arrow />
              <Node $variant="subtle">
                <Text textStyle={TextStyle.label.small.strong}>Merchant must confirm</Text>
                <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
                  Same confirm action as ASAP orders
                </Text>
              </Node>
              <BranchBottomStem />
            </MergeForkBranch>

            <MergeForkBranch $position="right">
              <LabeledDrop>
                <BranchLabel>
                  <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>
                    AUTO ACCEPT
                  </Text>
                </BranchLabel>
              </LabeledDrop>
              <NotificationBox>
                <BellIcon>🔔</BellIcon>
                <Text textStyle={TextStyle.label.small.default}>"Scheduled order needs prep"</Text>
              </NotificationBox>
              <Arrow />
              <Node $variant="subtle">
                <Text textStyle={TextStyle.label.small.strong}>Auto-confirmed</Text>
                <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
                  Automatically moves to In Progress
                </Text>
              </Node>
              <BranchBottomStem />
            </MergeForkBranch>
          </MergeForkRow>
          <Arrow />

          <Node $variant="subtle">
            <Text textStyle={TextStyle.label.small.strong}>Preparation begins</Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              Standard prep → ready → pickup flow
            </Text>
          </Node>

          <Arrow />

          <ResultNode $color="#006a25">
            <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.inverse.default}>
              Fulfilled at scheduled time
            </Text>
            <Text
              textStyle={TextStyle.body.small.default}
              color={TextColor.text.inverse.default}
              style={{ opacity: 0.7 }}
            >
              Delivered / picked up on time
            </Text>
          </ResultNode>
        </ForkBranch>
      </ForkRow>
    </DiagramContainer>
  );
}

function VisibilityTimeline() {
  const steps = [
    {
      label: "Order placed",
      description: "Customer selects a future delivery or pickup time slot and checks out",
    },
    {
      label: "\"New scheduled order\" notification",
      description:
        "Order appears on the All tab and the Scheduled tab with a dark gray \"Scheduled\" eyebrow. The order cannot be confirmed yet, but the merchant can cancel the order, mark items as out of stock, adjust prep time, and contact the customer.",
    },
    {
      label: "Prep window opens",
      description:
        "When the scheduled time minus estimated prep time is reached, the order becomes actionable. What happens next depends on the merchant's accept setting:",
      branches: [
        {
          pathway: "Manual accept",
          notification: "\"Scheduled order needs prep\"",
          outcome: "Merchant must tap Confirm (same action as ASAP orders)",
        },
        {
          pathway: "Auto accept",
          notification: "\"Scheduled order needs prep\"",
          outcome: "Order is auto-confirmed and moves to In Progress — no manual action needed",
        },
      ],
    },
    {
      label: "Ready for pickup / delivery",
      description:
        "Order is prepared and waiting for the Dasher or customer pickup at the scheduled time.",
    },
    {
      label: "Fulfilled",
      description:
        "Dasher picks up and delivers, or customer picks up — timed to the scheduled window.",
    },
  ];

  return (
    <DiagramContainer>
      <TimelineWrapper>
        {steps.map((step, i) => (
          <TimelineStep key={i}>
            <TimelineNumberTrack $isFirst={i === 0} $isLast={i === steps.length - 1}>
              <TimelineNumber>{i + 1}</TimelineNumber>
            </TimelineNumberTrack>
            <TimelineContent>
              <Text textStyle={TextStyle.label.small.strong}>{step.label}</Text>
              <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
                {step.description}
              </Text>
              {step.branches && (
                <PathwayRow>
                  {step.branches.map((branch) => (
                    <PathwayCard key={branch.pathway} $accent={branch.pathway === "Manual accept" ? "#e67e22" : "#2980b9"}>
                      <Text textStyle={TextStyle.label.small.strong}>{branch.pathway}</Text>
                      <PathwayNotification>
                        <span style={{ fontSize: 11 }}>🔔</span>
                        <Text textStyle={TextStyle.label.small.default} style={{ fontSize: 11 }}>
                          {branch.notification}
                        </Text>
                      </PathwayNotification>
                      <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default} style={{ fontSize: 12 }}>
                        {branch.outcome}
                      </Text>
                    </PathwayCard>
                  ))}
                </PathwayRow>
              )}
            </TimelineContent>
          </TimelineStep>
        ))}
      </TimelineWrapper>
      <PrepWindowFormula />
    </DiagramContainer>
  );
}

// ============================================================================
// PREP WINDOW FORMULA
// ============================================================================

const FormulaWrapper = styled.div`
  width: 100%;
  max-width: 580px;
  margin-top: ${Spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${Spacing.medium};
`;

const FormulaCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${Spacing.medium};
  padding: ${Spacing.large};
  border-radius: ${Theme.usage.borderRadius.large};
  background: ${Theme.usage.color.background.default};
  border: 1.5px solid ${Theme.usage.color.border.default};
`;

const FormulaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const FormulaBlock = styled.div<{ $bg: string; $border: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: ${Spacing.small} ${Spacing.medium};
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${(p) => p.$bg};
  border: 1.5px solid ${(p) => p.$border};
  min-width: 120px;
  text-align: center;
`;

const FormulaOperator = styled.div`
  font-family: "TT Norms", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${TextColor.text.subdued.default};
  line-height: 1;
`;

const FormulaEquals = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExampleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ExampleValue = styled.div`
  font-family: "TT Norms", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: ${TextColor.text.default};
`;

function PrepWindowFormula() {
  return (
    <FormulaWrapper>
      <FormulaCard>
        <Text textStyle={TextStyle.label.small.strong} style={{ textAlign: "center" }}>
          When does the prep window open?
        </Text>

        <FormulaBlock $bg="#f3f3f3" $border="#d4d4d4">
          <Text textStyle={TextStyle.label.small.strong}>Scheduled time</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Customer's chosen pickup / delivery time
          </Text>
        </FormulaBlock>

        <FormulaOperator>−</FormulaOperator>

        <FormulaBlock $bg="#fff8e7" $border="#e8d5a3">
          <Text textStyle={TextStyle.label.small.strong}>Prep time</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Merchant's set preparation time
          </Text>
        </FormulaBlock>

        <FormulaEquals>
          <FormulaOperator>=</FormulaOperator>
        </FormulaEquals>

        <FormulaRow>
          <FormulaBlock $bg="#e6f4ea" $border="#a8d5b8">
            <Text textStyle={TextStyle.label.small.strong}>Prep window opens</Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              "Scheduled order needs prep" notification fires
            </Text>
          </FormulaBlock>
        </FormulaRow>

        <FormulaEquals>
          <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
            EXAMPLE
          </Text>
        </FormulaEquals>

        <ExampleRow>
          <ExampleValue>3:00 PM</ExampleValue>
          <FormulaOperator>−</FormulaOperator>
          <ExampleValue>25 min</ExampleValue>
          <FormulaOperator>=</FormulaOperator>
          <ExampleValue>2:35 PM</ExampleValue>
        </ExampleRow>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default} style={{ textAlign: "center" }}>
          A 3:00 PM scheduled order with 25 min prep time becomes actionable at 2:35 PM
        </Text>
      </FormulaCard>
    </FormulaWrapper>
  );
}

// (ComparisonDiagram removed — tab no longer used)

// (CompatGrid/CompatChip removed — tab no longer used)

// (ImportantCallouts removed — tab no longer used)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FigmaEmbed = styled.iframe`
  width: 100%;
  max-width: 800px;
  height: 600px;
  border: 1px solid ${IconColor.border.default};
  border-radius: ${Theme.usage.borderRadius.large};
`;

const FigmaEmbedGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.xSmall};
  width: 100%;
  max-width: 800px;
`;

const FigmaEmbedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Spacing.large};
  align-items: center;
  width: 100%;
`;

const tabs: { id: ViewTab; label: string }[] = [
  { id: "lifecycle", label: "Order Lifecycle" },
  { id: "visibility", label: "Timeline" },
  { id: "designs", label: "Designs" },
];

export function ScheduledOrdersDiagram() {
  const [activeTab, setActiveTab] = useState<ViewTab>("lifecycle");

  return (
    <Wrapper>
      <TabRow>
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

      {activeTab === "lifecycle" && <LifecycleDiagram />}
      {activeTab === "visibility" && <VisibilityTimeline />}

      {activeTab === "designs" && (
        <FigmaEmbedSection>
          <FigmaEmbedGroup>
            <Text textStyle={TextStyle.label.small.strong}>Scheduled order card and details</Text>
            <FigmaEmbed
              src="https://embed.figma.com/design/vpZgVAibjGKxfoByVaplhW/-SoT--Mx-Tablet?node-id=644-46493&embed-host=share"
              allowFullScreen
            />
          </FigmaEmbedGroup>
          <FigmaEmbedGroup>
            <Text textStyle={TextStyle.label.small.strong}>New scheduled order notification</Text>
            <FigmaEmbed
              src="https://embed.figma.com/design/vpZgVAibjGKxfoByVaplhW/-SoT--Mx-Tablet?node-id=4042-86349&embed-host=share"
              allowFullScreen
            />
          </FigmaEmbedGroup>
          <FigmaEmbedGroup>
            <Text textStyle={TextStyle.label.small.strong}>Manual accept scheduled order needs prep notification</Text>
            <FigmaEmbed
              src="https://embed.figma.com/design/vpZgVAibjGKxfoByVaplhW/-SoT--Mx-Tablet?node-id=4042-85277&embed-host=share"
              allowFullScreen
            />
          </FigmaEmbedGroup>
          <FigmaEmbedGroup>
            <Text textStyle={TextStyle.label.small.strong}>Auto-accept scheduled order needs prep notification</Text>
            <FigmaEmbed
              src="https://embed.figma.com/design/vpZgVAibjGKxfoByVaplhW/-SoT--Mx-Tablet?node-id=4042-85489&embed-host=share"
              allowFullScreen
            />
          </FigmaEmbedGroup>
        </FigmaEmbedSection>
      )}

      <SourceRef>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Source: <CodeChip>Timing</CodeChip> type in <CodeChip>OrderCard.tsx</CodeChip>,{" "}
          <CodeChip>EYEBROW_COLORS.scheduled</CodeChip>,{" "}
          <CodeChip>StorefrontOrderType</CodeChip> timing
        </Text>
      </SourceRef>
    </Wrapper>
  );
}
