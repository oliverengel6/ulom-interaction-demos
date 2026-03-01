import { useState } from "react";
import styled from "styled-components";
import {
  Text,
  TextStyle,
  TextColor,
  Spacing,
  Theme,
  Tag,
  TagType,
  TagSize,
  TagStyle,
  IconType,
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
      case "accent":
        return Theme.usage.color.background.strong.default;
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

const SplitContainer = styled.div`
  display: flex;
  gap: ${Spacing.small};
  align-items: flex-start;
`;

const SplitBranch = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  min-width: 130px;
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

const BucketRow = styled.div`
  display: flex;
  gap: ${Spacing.xSmall};
  align-items: stretch;
`;

const Bucket = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: ${Spacing.small} ${Spacing.small};
  border-radius: ${Theme.usage.borderRadius.medium};
  background: ${Theme.usage.color.background.default};
  border: 1.5px solid ${Theme.usage.color.border.default};
  text-align: center;
  flex: 1;
  min-width: 0;
`;

const BucketHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const DotGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: -2px;

  & > *:not(:first-child) {
    margin-left: -2px;
  }
`;

const Dot = styled.div<{ $color: string; $outline?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: ${Theme.usage.borderRadius.full};
  background: ${(p) => p.$color};
  flex-shrink: 0;
  ${(p) => p.$outline && `box-shadow: 0 0 0 1.5px white; z-index: 1;`}
  position: relative;
`;

const BucketDesc = styled(Text).attrs({
  textStyle: TextStyle.body.small.default,
  color: TextColor.text.subdued.default,
})`
  font-size: 12px;
  line-height: 16px;
  text-align: center;
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

type FilterTab = "all" | "needs_action" | "in_progress" | "ready";

function AllTabDiagram() {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>All active orders</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Picked-up orders are excluded
        </Text>
      </Node>
      <Arrow />

      <StepLabel>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          GROUP BY ORDER STATE
        </Text>
      </StepLabel>
      <Arrow />

      <BucketRow>
        <Bucket>
          <BucketHeader>
            <DotGroup>
              <Dot $color="#006A25" $outline />
              <Dot $color="#B71000" />
            </DotGroup>
            <Text textStyle={TextStyle.label.small.strong}>Needs action</Text>
          </BucketHeader>
          <BucketDesc>Confirmations, cancellations, and remakes</BucketDesc>
          <Tag text="Oldest first" tagType={TagType.highlight} tagStyle={TagStyle.subdued} size={TagSize.small} leadingIcon={{ type: IconType.FunnelLine }} />
        </Bucket>
        <Bucket>
          <BucketHeader>
            <Dot $color="#1537C7" />
            <Text textStyle={TextStyle.label.small.strong}>In progress</Text>
          </BucketHeader>
          <BucketDesc>Being prepared by the store</BucketDesc>
          <Tag text="Pickup soonest" tagType={TagType.highlight} tagStyle={TagStyle.subdued} size={TagSize.small} leadingIcon={{ type: IconType.FunnelLine }} />
        </Bucket>
        <Bucket>
          <BucketHeader>
            <Dot $color="#7F1041" />
            <Text textStyle={TextStyle.label.small.strong}>Ready</Text>
          </BucketHeader>
          <BucketDesc>Waiting for Dasher pickup</BucketDesc>
          <Tag text="Pickup soonest" tagType={TagType.highlight} tagStyle={TagStyle.subdued} size={TagSize.small} leadingIcon={{ type: IconType.FunnelLine }} />
        </Bucket>
      </BucketRow>

      <Arrow />

      <ResultNode>
        <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.inverse.default}>
          Display in priority order
        </Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.inverse.default} style={{ opacity: 0.7 }}>
          Needs action → In progress → Ready
        </Text>
      </ResultNode>
    </DiagramContainer>
  );
}

function NeedsActionDiagram() {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>Needs Action orders</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          New orders, cancellations, unread chats, and remakes
        </Text>
      </Node>
      <Arrow />

      <StepLabel>
        <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
          SORT BY PRIORITY (3 TIEBREAKERS)
        </Text>
      </StepLabel>
      <Arrow />

      <SplitContainer>
        <SplitBranch>
          <StepLabel>
            <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
              1ST
            </Text>
          </StepLabel>
          <Node $variant="subtle">
            <Text textStyle={TextStyle.label.small.strong}>Unread messages</Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              Orders with unread
            </Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              chats appear first
            </Text>
          </Node>
        </SplitBranch>
        <SplitBranch>
          <StepLabel>
            <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
              2ND
            </Text>
          </StepLabel>
          <Node $variant="subtle">
            <Text textStyle={TextStyle.label.small.strong}>Pending remakes</Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              Remake requests
            </Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              shown before others
            </Text>
          </Node>
        </SplitBranch>
        <SplitBranch>
          <StepLabel>
            <Text textStyle={TextStyle.label.small.default} color={TextColor.text.subdued.default}>
              3RD
            </Text>
          </StepLabel>
          <Node $variant="subtle">
            <Text textStyle={TextStyle.label.small.strong}>Order age</Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              Oldest orders
            </Text>
            <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
              shown first
            </Text>
          </Node>
        </SplitBranch>
      </SplitContainer>

      <Arrow />

      <ResultNode>
        <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.inverse.default}>
          Final order
        </Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.inverse.default} style={{ opacity: 0.7 }}>
          Unread chats → Remakes → Oldest first
        </Text>
      </ResultNode>
    </DiagramContainer>
  );
}

function SimpleSortDiagram({
  title,
  subtitle,
  filterDesc,
  sortDesc,
}: {
  title: string;
  subtitle: string;
  filterDesc: string;
  sortDesc: string;
}) {
  return (
    <DiagramContainer>
      <Node>
        <Text textStyle={TextStyle.label.small.strong}>{title}</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          {subtitle}
        </Text>
      </Node>
      <Arrow />

      <Node $variant="subtle">
        <Text textStyle={TextStyle.label.small.strong}>Filter</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          {filterDesc}
        </Text>
      </Node>
      <Arrow />

      <Node $variant="subtle">
        <Text textStyle={TextStyle.label.small.strong}>Exclude picked up</Text>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Already completed orders are hidden
        </Text>
      </Node>
      <Arrow />

      <ResultNode>
        <Text textStyle={TextStyle.label.small.strong} color={TextColor.text.inverse.default}>
          {sortDesc}
        </Text>
      </ResultNode>
    </DiagramContainer>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const tabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs_action", label: "Needs Action" },
  { id: "in_progress", label: "In Progress" },
  { id: "ready", label: "Ready" },
];

export function OrderSortingDiagram() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

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

      {activeTab === "all" && <AllTabDiagram />}
      {activeTab === "needs_action" && <NeedsActionDiagram />}
      {activeTab === "in_progress" && (
        <SimpleSortDiagram
          title="In Progress orders"
          subtitle="Orders currently being prepared by the store"
          filterDesc="Only orders in preparation"
          sortDesc="Sort by earliest pickup time"
        />
      )}
      {activeTab === "ready" && (
        <SimpleSortDiagram
          title="Ready orders"
          subtitle="Completed orders waiting for Dasher"
          filterDesc="Only orders ready for pickup"
          sortDesc="Sort by earliest pickup time"
        />
      )}

      <SourceRef>
        <Text textStyle={TextStyle.body.small.default} color={TextColor.text.subdued.default}>
          Source: <CodeChip>OrderHomeViewModel.kt</CodeChip> → <CodeChip>sortOrders()</CodeChip>
        </Text>
      </SourceRef>
    </Wrapper>
  );
}
