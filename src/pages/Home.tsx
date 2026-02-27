import { useState } from "react";
import styled from "styled-components";
import {
  Button,
  ButtonType,
  ButtonSize,
  IconButton,
  IconButtonType,
  IconButtonSize,
  IconType,
  IconColor,
  InlineChildren,
  Inset,
  InsetSize,
  Logo,
  LogoType,
  SingleSelectGroup,
  SingleSelectGroupSize,
  SingleSelectGroupType,
  Spacing,
  StackChildren,
  Tag,
  TagSize,
  TagType,
  Text,
  TextStyle,
  TextColor,
  SearchField,
  SearchFieldSize,
  Alignment,
  Justification,
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavCell,
  Theme,
} from "@doordash/prism-react";

// ============================================================================
// LAYOUT CONTAINERS - Minimal styled-components for core layout structure
// ============================================================================

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${IconColor.background.default};
`;

const PageBody = styled.div`
  display: flex;
  flex: 1;
`;

const SidebarContainer = styled.div`
  height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
  width: 220px;
  border-right: 1px solid ${IconColor.border.default};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  min-width: 0;
`;

// ============================================================================
// HEADER COMPONENTS - Matching real DoorDash header layout
// ============================================================================

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: ${Spacing.large};
  background-color: ${IconColor.background.default};
  border-bottom: 1px solid ${IconColor.border.default};
  position: sticky;
  top: 0;
  height: 64px;
  z-index: 100;
`;

const LogoWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  width: 220px;
  padding-left: ${Spacing.large};
`;

const SearchWrapper = styled.div`
  flex: 1;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.xSmall};
  margin-left: auto;
  padding-right: ${Spacing.small};
`;

// LocationButton removed - using Prism Button with flatSecondary

// ============================================================================
// CONTENT AREA
// ============================================================================

// ContentArea removed - using Prism Inset

// ============================================================================
// CATEGORY PILLS - Matching real DoorDash style
// ============================================================================

const CategoryPillsWrapper = styled.div`
  display: flex;
  gap: ${Spacing.xSmall};
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

// ============================================================================
// SECTION HEADER - Title with controls on the right
// ============================================================================

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${Spacing.xSmall};
  flex-shrink: 0;
`;

// ============================================================================
// RESPONSIVE GRID LAYOUTS - Single row, responsive columns, no wrapping
// ============================================================================

// Grid for small cards (Deals) - 6 columns that fill available width
const ResponsiveGridSmall = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: ${Spacing.medium};
`;

// Grid for large cards (Most loved, Grocery) - 3 columns that fill available width
const ResponsiveGridLarge = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${Spacing.medium};
`;

// ============================================================================
// CARD IMAGE - Positioned container for image with overlay elements
// ============================================================================

// Note: Prism ResponsivePicture is for DoorDash CDN URLs only. For external
// images (like Unsplash), we need a minimal styled img component.

// Square image container with rounded corners (for Deals carousel)
const CardImageContainerSquare = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: ${Theme.usage.borderRadius.medium};
  overflow: hidden;
`;

// Rectangular image container with rounded corners (for Most loved / Grocery)
const CardImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: ${Theme.usage.borderRadius.medium};
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: ${Spacing.xSmall};
  right: ${Spacing.xSmall};
`;

// ============================================================================
// MOCK DATA
// ============================================================================

const navItems = [
  { id: "home", icon: IconType.HomeLine, label: "Home" },
  { id: "grocery", icon: IconType.GroceryLine, label: "Grocery" },
  { id: "retail", icon: IconType.RetailLine, label: "Retail" },
  { id: "convenience", icon: IconType.ConvenienceLine, label: "Convenience" },
  { id: "beauty", icon: IconType.BeautyLine, label: "Beauty" },
  { id: "cbd", icon: IconType.EyedropperLine, label: "CBD/THC" },
  { id: "office", icon: IconType.NotebookLine, label: "Office" },
  { id: "home-goods", icon: IconType.LampLine, label: "Home Goods" },
  { id: "browse", icon: IconType.SearchLine, label: "Browse All" },
];

const secondaryNavItems = [
  { id: "orders", icon: IconType.ReceiptLine, label: "Orders" },
  { id: "account", icon: IconType.PersonProfileLine, label: "Account" },
  { id: "switch", icon: IconType.Swap, label: "Switch Account" },
];

const categories = [
  { emoji: "🍛", label: "Indian" },
  { emoji: "🍕", label: "Pizza" },
  { emoji: "🟢", label: "DashPass" },
  { emoji: "🥗", label: "Healthy" },
  { emoji: "🥡", label: "Chinese" },
  { emoji: "🍟", label: "Fast Food" },
  { emoji: "🍰", label: "Desserts" },
  { emoji: "🍔", label: "Burgers" },
  { emoji: "🍗", label: "Chicken" },
  { emoji: "🏷️", label: "Deals" },
  { emoji: "🍜", label: "Thai" },
  { emoji: "🥙", label: "Halal" },
  { emoji: "🌮", label: "Mexican" },
  { emoji: "🍣", label: "Sushi" },
];

const dealsRestaurants = [
  {
    id: 1,
    name: "Taqueria Downtown",
    rating: 4.5,
    reviews: "200+",
    distance: "0.2 mi",
    time: "24 min",
    promo: "$5 off on $25+",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "The Cheesecake Factory",
    rating: 4.3,
    reviews: "500+",
    distance: "1.2 mi",
    time: "45 min",
    promo: "$10 off on $50+",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "honeygrow",
    rating: 4.6,
    reviews: "300+",
    distance: "0.8 mi",
    time: "28 min",
    promo: "20% off on $15+",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Domino's",
    rating: 4.1,
    reviews: "1k+",
    distance: "0.5 mi",
    time: "25 min",
    promo: "35% off select items",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Alfalfa",
    rating: 4.7,
    reviews: "150+",
    distance: "0.3 mi",
    time: "20 min",
    promo: "$4 off on $15+",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Sarku Japan",
    rating: 4.2,
    reviews: "400+",
    distance: "1.0 mi",
    time: "35 min",
    promo: "20% off on $15+",
    image:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
  },
];

const mostLovedRestaurants = [
  {
    id: 7,
    name: "South of the Cloud",
    rating: 4.5,
    reviews: "200+",
    distance: "0.2 mi",
    time: "24 min",
    fee: "$0 delivery fee over $7",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    name: "Ayame Hibachi & Sushi",
    rating: 4.7,
    reviews: "1k+",
    distance: "1.6 mi",
    time: "60 min",
    fee: "$0 delivery fee over $7",
    sponsored: true,
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
  },
  {
    id: 9,
    name: "Bobwhite Counter",
    rating: 4.7,
    reviews: "6k+",
    distance: "0.6 mi",
    time: "25 min",
    fee: "$0 delivery fee over $7",
    tags: ["Customer favorite", "#1 Chicken"],
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
  },
  {
    id: 10,
    name: "62 secret kitchen",
    rating: 4.5,
    reviews: "200+",
    distance: "0.5 mi",
    time: "32 min",
    fee: "$0 delivery fee over $7",
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
  },
  {
    id: 11,
    name: "Golden wings fish and chicken",
    rating: 4.5,
    reviews: "500+",
    distance: "2.1 mi",
    time: "44 min",
    fee: "$0 delivery fee over $7",
    promo: "$6 off on $40+",
    sponsored: true,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
  },
];

const groceryStores = [
  {
    id: 1,
    name: "ShopRite",
    rating: 4.5,
    reviews: "10k+",
    distance: "0.2 mi",
    time: "57 min",
    fee: "$0 delivery fee on $7+ by 7:00 PM",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Stop & Shop",
    rating: 4.6,
    reviews: "2k+",
    distance: "1.7 mi",
    time: "89 min",
    fee: "$0 delivery fee on $7+ by 7:32 PM",
    image:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "ACME",
    rating: 4.7,
    reviews: "8k+",
    distance: "0.9 mi",
    time: "59 min",
    fee: "$0 delivery fee on $7+ by 7:02 PM",
    image:
      "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "BJ's Wholesale Club",
    rating: 4.7,
    reviews: "3k+",
    distance: "800 ft",
    time: "56 min",
    fee: "$0 delivery fee on $7+ by 6:59 PM",
    image:
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "99 Ranch Market",
    rating: 4.3,
    reviews: "1k+",
    distance: "0.7 mi",
    time: "67 min",
    fee: "$0 delivery fee on $7+ by 7:15 PM",
    image:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=300&fit=crop",
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Home = () => {
  const [deliveryMode, setDeliveryMode] = useState<number>(0);
  const [activeNavItem, setActiveNavItem] = useState<string | null>("home");

  return (
    <PageContainer>
      {/* ================================================================ */}
      {/* HEADER - Spans full width */}
      {/* ================================================================ */}
      <Header>
        <LogoWrapper>
          <Logo type={LogoType.logo} />
        </LogoWrapper>

        <SearchWrapper>
          <SearchField
            size={SearchFieldSize.small}
            placeholder="Search DoorDash"
            label="Search"
            isRounded
            isLabelHidden
            value=""
            onChange={() => {}}
          />
        </SearchWrapper>

        <HeaderControls>
          <Button
            type={ButtonType.secondary}
            size={ButtonSize.small}
            leadingIcon={IconType.LocationPinEnabledFill}
            trailingIcon={IconType.ChevronDown}
            isInline
          >
            140 Bay St
          </Button>

          <SingleSelectGroup
            size={SingleSelectGroupSize.small}
            type={SingleSelectGroupType.secondaryPill}
            options={["Delivery", "Pickup"]}
            selectedIndex={deliveryMode}
            onChange={(index) => setDeliveryMode(index ?? 0)}
            accessibilityLabel="Select delivery or pickup"
            isInline
          />

          <IconButton
            iconType={IconType.NotifyLine}
            size={IconButtonSize.small}
            type={IconButtonType.secondary}
            accessibilityLabel="Notifications"
          />

          <Button
            type={ButtonType.primary}
            size={ButtonSize.small}
            leadingIcon={IconType.CartFill}
            isInline
          >
            0
          </Button>
        </HeaderControls>
      </Header>

      {/* ================================================================ */}
      {/* PAGE BODY - Sidebar + Main Content */}
      {/* ================================================================ */}
      <PageBody>
        {/* Sidebar */}
        <SidebarContainer>
          <SideNav
            label="Main navigation"
            activeItem={activeNavItem}
            onActiveItemChange={(item) => setActiveNavItem(item)}
            width={180}
            shouldFillContainer
          >
            <SideNavGroup hasSeparator>
              {navItems.map((item) => (
                <SideNavItem key={item.id} id={item.id}>
                  <SideNavCell
                    icon={item.icon}
                    label={item.label}
                    isActive={activeNavItem === item.id}
                  />
                </SideNavItem>
              ))}
            </SideNavGroup>

            <SideNavGroup hasSeparator={false}>
              {secondaryNavItems.map((item) => (
                <SideNavItem key={item.id} id={item.id}>
                  <SideNavCell
                    icon={item.icon}
                    label={item.label}
                    isActive={activeNavItem === item.id}
                  />
                </SideNavItem>
              ))}
            </SideNavGroup>
          </SideNav>
        </SidebarContainer>

        {/* Main Content */}
        <MainContent>
          {/* Content */}
          <Inset size={InsetSize.medium} horizontalSize={InsetSize.large}>
            <StackChildren size={Spacing.large}>
              {/* Welcome Message */}
              <Text textStyle={TextStyle.title.large}>
                Good evening, Zachary
              </Text>

              {/* Category Pills */}
              <CategoryPillsWrapper>
                {categories.map((category) => (
                  <Button
                    key={category.label}
                    type={ButtonType.tertiary}
                    size={ButtonSize.medium}
                    leadingText={category.emoji}
                    isInline
                  >
                    {category.label}
                  </Button>
                ))}
              </CategoryPillsWrapper>

              {/* Deals for you Section */}
              <StackChildren size={Spacing.medium}>
                <SectionHeader>
                  <Text textStyle={TextStyle.title.large}>Deals for you</Text>
                  <SectionControls>
                    <Button
                      type={ButtonType.flatSecondary}
                      size={ButtonSize.small}
                      isInline
                    >
                      See All
                    </Button>
                    <IconButton
                      iconType={IconType.ChevronLeft}
                      size={IconButtonSize.small}
                      type={IconButtonType.tertiary}
                      accessibilityLabel="Previous"
                    />
                    <IconButton
                      iconType={IconType.ChevronRight}
                      size={IconButtonSize.small}
                      type={IconButtonType.tertiary}
                      accessibilityLabel="Next"
                    />
                  </SectionControls>
                </SectionHeader>

                <ResponsiveGridSmall>
                  {dealsRestaurants.slice(0, 6).map((restaurant) => (
                    <StackChildren key={restaurant.id} size={Spacing.xSmall}>
                      <CardImageContainerSquare>
                        <CardImage
                          src={restaurant.image}
                          alt={restaurant.name}
                        />
                        <ImageOverlay>
                          <IconButton
                            iconType={IconType.FavoriteLine}
                            size={IconButtonSize.small}
                            type={IconButtonType.tertiary}
                            accessibilityLabel="Save to favorites"
                          />
                        </ImageOverlay>
                      </CardImageContainerSquare>
                      <StackChildren size={Spacing.xxSmall}>
                        <Text
                          textStyle={TextStyle.label.small.strong}
                          color={TextColor.positive.default}
                        >
                          {restaurant.promo}
                        </Text>
                        <Text textStyle={TextStyle.label.medium.strong}>
                          {restaurant.name}
                        </Text>
                      </StackChildren>
                    </StackChildren>
                  ))}
                </ResponsiveGridSmall>
              </StackChildren>

              {/* Most loved Section */}
              <StackChildren size={Spacing.medium}>
                <SectionHeader>
                  <Text textStyle={TextStyle.title.large}>Most loved</Text>
                  <SectionControls>
                    <Button
                      type={ButtonType.flatSecondary}
                      size={ButtonSize.small}
                      isInline
                    >
                      See All
                    </Button>
                    <IconButton
                      iconType={IconType.ChevronLeft}
                      size={IconButtonSize.small}
                      type={IconButtonType.tertiary}
                      accessibilityLabel="Previous"
                    />
                    <IconButton
                      iconType={IconType.ChevronRight}
                      size={IconButtonSize.small}
                      type={IconButtonType.tertiary}
                      accessibilityLabel="Next"
                    />
                  </SectionControls>
                </SectionHeader>

                <ResponsiveGridLarge>
                  {mostLovedRestaurants.slice(0, 3).map((restaurant) => (
                    <StackChildren key={restaurant.id} size={Spacing.xSmall}>
                      <CardImageContainer>
                        <CardImage
                          src={restaurant.image}
                          alt={restaurant.name}
                        />
                      </CardImageContainer>
                      <StackChildren size={Spacing.xxSmall}>
                        <InlineChildren
                          justifyContent={Justification.spaceBetween}
                          alignItems={Alignment.center}
                        >
                          <Text textStyle={TextStyle.label.medium.strong}>
                            {restaurant.name}
                          </Text>
                          <IconButton
                            iconType={IconType.FavoriteLine}
                            size={IconButtonSize.small}
                            type={IconButtonType.flatSecondary}
                            accessibilityLabel="Save restaurant"
                          />
                        </InlineChildren>
                        <InlineChildren size={Spacing.xxSmall}>
                          <Text textStyle={TextStyle.body.small.strong}>
                            {restaurant.rating}★
                          </Text>
                          <Text
                            textStyle={TextStyle.body.small.default}
                            color={TextColor.text.subdued.default}
                          >
                            ({restaurant.reviews})
                          </Text>
                          <Text
                            textStyle={TextStyle.body.small.default}
                            color={TextColor.text.subdued.default}
                          >
                            • {restaurant.distance}
                          </Text>
                          <Text
                            textStyle={TextStyle.body.small.default}
                            color={TextColor.text.subdued.default}
                          >
                            • {restaurant.time}
                          </Text>
                        </InlineChildren>
                        <Text
                          textStyle={TextStyle.body.small.default}
                          color={TextColor.text.subdued.default}
                        >
                          {restaurant.fee}
                        </Text>
                        {restaurant.promo && (
                          <Text
                            textStyle={TextStyle.label.small.strong}
                            color={TextColor.positive.default}
                          >
                            {restaurant.promo}
                          </Text>
                        )}
                        {restaurant.sponsored && (
                          <Text
                            textStyle={TextStyle.body.small.default}
                            color={TextColor.text.subdued.default}
                          >
                            Sponsored
                          </Text>
                        )}
                        {restaurant.tags && (
                          <InlineChildren size={Spacing.xSmall}>
                            {restaurant.tags.map((tag) => (
                              <Tag
                                key={tag}
                                size={TagSize.small}
                                text={tag}
                                tagType={TagType.informational}
                              />
                            ))}
                          </InlineChildren>
                        )}
                      </StackChildren>
                    </StackChildren>
                  ))}
                </ResponsiveGridLarge>
              </StackChildren>

              {/* Grocery Section */}
              <StackChildren size={Spacing.medium}>
                <SectionHeader>
                  <Text textStyle={TextStyle.title.large}>Grocery</Text>
                  <SectionControls>
                    <Button
                      type={ButtonType.flatSecondary}
                      size={ButtonSize.small}
                      isInline
                    >
                      See All
                    </Button>
                    <IconButton
                      iconType={IconType.ChevronLeft}
                      size={IconButtonSize.small}
                      type={IconButtonType.tertiary}
                      accessibilityLabel="Previous"
                    />
                    <IconButton
                      iconType={IconType.ChevronRight}
                      size={IconButtonSize.small}
                      type={IconButtonType.tertiary}
                      accessibilityLabel="Next"
                    />
                  </SectionControls>
                </SectionHeader>

                <ResponsiveGridLarge>
                  {groceryStores.slice(0, 3).map((store) => (
                    <StackChildren key={store.id} size={Spacing.xSmall}>
                      <CardImageContainer>
                        <CardImage src={store.image} alt={store.name} />
                        <ImageOverlay>
                          <IconButton
                            iconType={IconType.FavoriteLine}
                            size={IconButtonSize.small}
                            type={IconButtonType.tertiary}
                            accessibilityLabel="Save to favorites"
                          />
                        </ImageOverlay>
                      </CardImageContainer>
                      <StackChildren size={Spacing.xxSmall}>
                        <Text textStyle={TextStyle.label.medium.strong}>
                          {store.name}
                        </Text>
                        <InlineChildren size={Spacing.xxSmall}>
                          <Text textStyle={TextStyle.body.small.default}>
                            {store.rating}★
                          </Text>
                          <Text
                            textStyle={TextStyle.body.small.default}
                            color={TextColor.text.subdued.default}
                          >
                            ({store.reviews})
                          </Text>
                          <Text
                            textStyle={TextStyle.body.small.default}
                            color={TextColor.text.subdued.default}
                          >
                            • {store.distance}
                          </Text>
                          <Text
                            textStyle={TextStyle.body.small.default}
                            color={TextColor.text.subdued.default}
                          >
                            • 🛒 {store.time}
                          </Text>
                        </InlineChildren>
                        <Text
                          textStyle={TextStyle.body.small.default}
                          color={TextColor.text.subdued.default}
                        >
                          {store.fee}
                        </Text>
                      </StackChildren>
                    </StackChildren>
                  ))}
                </ResponsiveGridLarge>
              </StackChildren>
            </StackChildren>
          </Inset>
        </MainContent>
      </PageBody>
    </PageContainer>
  );
};
