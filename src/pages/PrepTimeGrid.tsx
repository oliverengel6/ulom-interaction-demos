import { useState, useCallback } from "react";
import styled from "styled-components";
import {
  Icon,
  IconButton,
  IconButtonType,
  IconButtonSize,
  IconType,
  Theme,
} from "@doordash/prism-react";

// ============================================================================
// LAYOUT
// ============================================================================

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px;
  width: 100%;
`;

const CardContainer = styled.div`
  position: relative;
  width: 320px;
  height: 560px;
  background: #fff;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  display: flex;
  flex-direction: column;

  * {
    font-family: inherit !important;
  }
`;

// ============================================================================
// EYEBROW
// ============================================================================

const Eyebrow = styled.div`
  background: #006a25;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
`;

const EyebrowText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #fff;
`;

// ============================================================================
// HEADER
// ============================================================================

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 12px 8px 8px 16px;
  flex-shrink: 0;
`;

const CustomerName = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #181818;
  letter-spacing: -0.01em;
`;

const PrepTimeButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px 8px 16px;
  border-radius: 9999px;
  background: #f1f1f1;
  font-size: 16px;
  font-weight: 700;
  color: #181818;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: #e5e5e5;
  }
`;

// ============================================================================
// PREP TIME GRID
// ============================================================================

const GridCollapsible = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${(props) => (props.$open ? "1fr" : "0fr")};
  transition: grid-template-rows
    ${(props) =>
      props.$open
        ? Theme.usage.motion.duration.auto.default.xShort
        : Theme.usage.motion.duration.functional.exit.short}
    ${(props) =>
      props.$open
        ? Theme.usage.motion.easing.spring.out.default
        : Theme.usage.motion.easing.subtle.exit};
  flex-shrink: 0;
`;

const GridInner = styled.div`
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const ReadyInTitle = styled.div`
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: #181818;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 0 16px;
`;

const TimeCell = styled.button<{ $color: "green" | "yellow" | "red" }>`
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 0;
  border-radius: 10px;
  -webkit-tap-highlight-color: transparent;
  background: ${(props) => {
    switch (props.$color) {
      case "green":
        return "#e8f5e9";
      case "yellow":
        return "#fff9e6";
      case "red":
        return "#fce8e8";
    }
  }};

  &:active {
    opacity: 0.7;
  }
`;

const TimeValue = styled.div<{ $color: "green" | "yellow" | "red" }>`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => {
    switch (props.$color) {
      case "green":
        return "#2e7d32";
      case "yellow":
        return "#b8860b";
      case "red":
        return "#c62828";
    }
  }};
`;

const TimeUnit = styled.div<{ $color: "green" | "yellow" | "red" }>`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => {
    switch (props.$color) {
      case "green":
        return "#2e7d32";
      case "yellow":
        return "#b8860b";
      case "red":
        return "#c62828";
    }
  }};
`;

const CustomTimeButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 16px 12px;
  padding: 10px;
  border-radius: 9999px;
  background: #f1f1f1;
  font-size: 15px;
  font-weight: 600;
  color: #181818;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: #e5e5e5;
  }
`;

// ============================================================================
// SCROLLABLE CONTENT
// ============================================================================

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

const OrderMeta = styled.div`
  padding: 12px 16px 0;
  display: flex;
  flex-direction: column;
`;

const MetaTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #181818;
  line-height: 24px;
`;

const MetaSubtitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #6c6c6c;
  line-height: 22px;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 16px 0;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #fff9e6;
  font-size: 14px;
  font-weight: 700;
  color: #b8860b;
  line-height: 20px;
`;

const PlaceholderLine = styled.div<{ $width?: string; $height?: string }>`
  width: ${(props) => props.$width || "100%"};
  height: ${(props) => props.$height || "14px"};
  background: #e9e9e9;
  border-radius: 6px;
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

const ItemsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0 16px;
`;

// ============================================================================
// FOOTER
// ============================================================================

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  flex-shrink: 0;
  background: linear-gradient(to top, white 59%, rgba(255, 255, 255, 0));
`;

const MoreButton = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;
  color: #181818;
  letter-spacing: 2px;
`;

const ConfirmButton = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 24px;
  border-radius: 9999px;
  background: #181818;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
`;

// ============================================================================
// DATA
// ============================================================================

type TimeColor = "green" | "yellow" | "red";

const timeOptions: { value: number; color: TimeColor }[] = [
  { value: 8, color: "green" },
  { value: 10, color: "green" },
  { value: 12, color: "green" },
  { value: 14, color: "yellow" },
  { value: 16, color: "yellow" },
  { value: 18, color: "yellow" },
  { value: 20, color: "red" },
  { value: 22, color: "red" },
  { value: 25, color: "red" },
];

const placeholderItems = [
  { nameWidth: "55%", modifiers: ["50%", "40%", "45%"] },
  { nameWidth: "60%", modifiers: ["45%", "50%", "45%"] },
  { nameWidth: "45%", modifiers: ["55%", "40%", "45%"] },
  { nameWidth: "50%", modifiers: ["40%", "50%"] },
  { nameWidth: "65%", modifiers: ["45%"] },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function PrepTimeGridDemo() {
  const [gridOpen, setGridOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(10);

  const toggleGrid = useCallback(() => setGridOpen((v) => !v), []);

  const selectTime = useCallback((time: number) => {
    setSelectedTime(time);
    setGridOpen(false);
  }, []);

  return (
    <Wrapper>
      <CardContainer>
        <Eyebrow>
          <EyebrowText>New</EyebrowText>
          <EyebrowText>#ABC123</EyebrowText>
        </Eyebrow>

        <Header>
          {gridOpen ? (
            <>
              <ReadyInTitle>Ready in</ReadyInTitle>
              <IconButton
                iconType={IconType.Close}
                size={IconButtonSize.medium}
                type={IconButtonType.tertiary}
                accessibilityLabel="Close"
                onClick={toggleGrid}
              />
            </>
          ) : (
            <>
              <CustomerName>David C</CustomerName>
              <PrepTimeButton onClick={toggleGrid}>
                {selectedTime} min
                <Icon type={IconType.SortOrder} />
              </PrepTimeButton>
            </>
          )}
        </Header>

        <GridCollapsible $open={gridOpen}>
          <GridInner>
            <Grid>
              {timeOptions.map((opt) => (
                <TimeCell
                  key={opt.value}
                  $color={opt.color}
                  onClick={() => selectTime(opt.value)}
                >
                  <TimeValue $color={opt.color}>{opt.value}</TimeValue>
                  <TimeUnit $color={opt.color}>min</TimeUnit>
                </TimeCell>
              ))}
            </Grid>
            <CustomTimeButton onClick={toggleGrid}>
              Custom time
            </CustomTimeButton>
          </GridInner>
        </GridCollapsible>

        <ScrollArea>
          <OrderMeta>
            <MetaTitle>$28.00 · 5 items</MetaTitle>
            <MetaSubtitle>Delivery</MetaSubtitle>
          </OrderMeta>

          <TagRow>
            <Tag>🏆 Top Customer</Tag>
          </TagRow>

          <ItemsSection>
            {placeholderItems.map((item, i) => (
              <ItemPlaceholder key={i}>
                <QuantityBox />
                <ItemLines>
                  <PlaceholderLine $width={item.nameWidth} $height="16px" />
                  {item.modifiers.map((w, j) => (
                    <PlaceholderLine key={j} $width={w} $height="12px" />
                  ))}
                </ItemLines>
              </ItemPlaceholder>
            ))}
          </ItemsSection>
        </ScrollArea>

        <Footer>
          <MoreButton>···</MoreButton>
          <ConfirmButton>Confirm</ConfirmButton>
        </Footer>
      </CardContainer>
    </Wrapper>
  );
}
