import styled from "styled-components";
import {
  Text,
  TextStyle,
  TextColor,
  Spacing,
  Theme,
} from "@doordash/prism-react";

// ============================================================================
// DIAGRAM PRIMITIVES (matching OrderSorting style)
// ============================================================================

const Wrapper = styled.div`
  width: 100%;
  padding: 0 0 40px;
`;

const DiagramContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
`;

const Node = styled.div<{ $variant?: "default" | "accent" | "subtle" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: ${Spacing.small} ${Spacing.large};
  border-radius: ${Theme.usage.borderRadius.medium};
  text-align: center;
  min-width: 180px;
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

const Arrow = styled.div`
  width: 2px;
  height: 20px;
  background: #E9E9E9;
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
    border-top: 5px solid #E9E9E9;
  }
`;

const ForkStem = styled.div`
  width: 2px;
  height: 16px;
  background: #E9E9E9;
  margin: 6px 0 0;
`;

const ForkRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Spacing.large};
`;

const ForkBranch = styled.div<{ $position: "left" | "right" | "middle" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    height: 2px;
    background: #E9E9E9;
    ${(p) =>
      p.$position === "left"
        ? `left: 50%; right: calc(-1 * ${Spacing.large} / 2);`
        : p.$position === "right"
          ? `left: calc(-1 * ${Spacing.large} / 2); right: 50%;`
          : "left: 50%; right: 50%; width: 2px; transform: translateX(-1px);"}
  }
`;


const ResultNode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: ${Spacing.small} ${Spacing.large};
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.background.inverse.default};
  text-align: center;
  min-width: 220px;
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
  background: #FFF8E7;
  border: 1.5px solid #E8D5A3;
`;


const OpenQuestionBlock = styled.div`
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${Spacing.xSmall};
  padding: ${Spacing.medium} ${Spacing.large};
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.background.strong.default};
  border-left: 3px solid ${Theme.usage.color.border.default};
`;

const QuestionItem = styled.div`
  display: flex;
  gap: ${Spacing.xSmall};
`;

const SectionGap = styled.div`
  height: ${Spacing.xLarge};
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
    background: #E9E9E9;
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
    border-top: 5px solid #E9E9E9;
  }
`;

// ============================================================================
// MAIN DIAGRAM
// ============================================================================

export function NotificationLogicDiagram() {
  return (
    <Wrapper>
      <DiagramContainer>
        {/* Entry */}
        <Node>
          <Text textStyle={TextStyle.label.small.strong}>Notification received</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            New order, cancellation, message, etc.
          </Text>
        </Node>
        <Arrow />

        {/* Decision: is Mx active? */}
        <DecisionNode>
          <Text textStyle={TextStyle.label.small.strong}>Is Mx active?</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Last interaction &lt; 5s ago OR overlay/flow open
          </Text>
        </DecisionNode>
        <ForkStem />

        {/* Split: Yes / No */}
        <ForkRow>
          <ForkBranch $position="left">
            <LabeledDrop>
              <BranchLabel>
                <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>YES</Text>
              </BranchLabel>
            </LabeledDrop>
            <ResultNode style={{ background: "#006a25" }}>
              <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.inverse.default}>
                Subtle alert
              </Text>
            </ResultNode>
            <Arrow />

            {/* Escalation path */}
            <DecisionNode>
              <Text textStyle={TextStyle.label.small.strong}>Mx active within 15s?</Text>
              <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
                While subtle alert is visible
              </Text>
            </DecisionNode>
            <ForkStem />

            <ForkRow>
              <ForkBranch $position="left">
                <LabeledDrop>
                  <BranchLabel>
                    <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>YES</Text>
                  </BranchLabel>
                </LabeledDrop>
                <Node $variant="subtle">
                  <Text textStyle={TextStyle.label.small.strong}>Maintain subtle alert</Text>
                </Node>
              </ForkBranch>
              <ForkBranch $position="right">
                <LabeledDrop>
                  <BranchLabel>
                    <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>NO</Text>
                  </BranchLabel>
                </LabeledDrop>
                <Node $variant="subtle">
                  <Text textStyle={TextStyle.label.small.strong}>Escalate</Text>
                </Node>
                <Arrow />
                <ResultNode>
                  <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.inverse.default}>
                    Full screen alert
                  </Text>
                </ResultNode>
              </ForkBranch>
            </ForkRow>
          </ForkBranch>

          <ForkBranch $position="right">
            <LabeledDrop>
              <BranchLabel>
                <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.subdued.default}>NO</Text>
              </BranchLabel>
            </LabeledDrop>
            <ResultNode>
              <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.inverse.default}>
                Full screen alert
              </Text>
            </ResultNode>
          </ForkBranch>
        </ForkRow>
      </DiagramContainer>

      <SectionGap />
      <OpenQuestionBlock>
        <Text textStyle={TextStyle.label.small.strong}>What counts as "active"</Text>
        <QuestionItem>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>•</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Recent interaction — touched screen within the last ~5 seconds
          </Text>
        </QuestionItem>
        <QuestionItem>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>•</Text>
          <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
            Overlay open — order details, nav menu, or other modal/flow
          </Text>
        </QuestionItem>
      </OpenQuestionBlock>

    </Wrapper>
  );
}
