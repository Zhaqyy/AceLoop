import React from "react";
import { Button } from "@ui";
import '../ui.scss';

// ============================================
// // Please let me know before editing component or its style
// ============================================

/* eslint-disable react/prop-types */
/**
 * A flexible heading component that can render labels, main headings, subheadings, and buttons
 * with support for line breaks, custom styling, and alignment control.
 *
 * @param {Object} props - Component props
 * @param {string} [props.labelText] - Text for the optional label above the heading
 * @param {string} [props.labelClassName] - Additional className for the label component
 * @param {Object} [props.labelProps] - Additional props to pass to the label component (excluding className)
 * @param {string} [props.mainHeading] - Text for the main heading (supports <br/> for line breaks)
 * @param {string} [props.mainHeadingLevel='h1'] - HTML heading level (h1-h6) for main heading
 * @param {string} [props.mainHeadingClassName] - Additional className for the main heading element
 * @param {Object} [props.mainHeadingProps] - Additional props to pass to the main heading element (excluding className)
 * @param {string} [props.subHeading] - Text for the optional subheading (supports <br/>)
 * @param {string} [props.subHeadingClassName] - Additional className for the subheading element
 * @param {Object} [props.subHeadingProps] - Additional props to pass to the subheading element (excluding className)
 * @param {string} [props.btnText] - Text for the optional button
 * @param {string} [props.btnUrl] - URL for the optional button
 * @param {string} [props.btnVariant='underline-arrow'] - Button variant: 'primary', 'secondary', or 'underline-arrow'
 * @param {Object} [props.btnProps] - Additional props to pass to the Button component (e.g., textColor, backgroundColor, iconColor, underlineColor, href, disabled, etc.)
 * @param {boolean} [props.alignLeft=false] - If true, aligns all text and button to the left
 * @param {string} [props.containerClassName] - Additional className for the container div
 * @param {Object} [props.containerProps] - Additional props to pass to the container div (excluding className)
 * @param {boolean} [props.animateSubHeadingWords=false] - If true, the subheading text will be split into words for animation.
 */
const Heading = ({
  labelText,
  labelClassName = "",
  labelProps = {},
  mainHeading,
  mainHeadingLevel = "h1",
  mainHeadingClassName = "",
  mainHeadingProps = {},
  subHeading,
  subHeadingClassName = "",
  subHeadingProps = {},
  btnText,
  btnUrl = "#",
  btnVariant = "underline-arrow",
  btnProps = {},
  alignLeft = false,
  containerClassName = "",
  containerProps = {},
  animateSubHeadingWords = false,
}) => {
  const MainHeadingTag = mainHeadingLevel;

  // This function handles rendering text, either as a simple string or split into words for animation.
  // It also correctly handles <br/> tags.
  const renderText = (text, splitForAnimation = false) => {
    if (!text) return null;

    // If not splitting for animation, just render the text with line breaks
    if (!splitForAnimation) {
      return text.split("<br/>").map((line, i, arr) => (
        <React.Fragment key={i}>
          {line}
          {i !== arr.length - 1 && <br />}
        </React.Fragment>
      ));
    }

    // If splitting for animation (only for subheadings when animateSubHeadingWords is true)
    // Split by spaces and <br/> tags to handle both words and explicit line breaks
    const parts = text.split(/(\s+|<br\/>)/).filter(Boolean); // Filter(Boolean) removes empty strings from the split

    return parts.map((part, i) => {
      if (part === "<br/>") {
        return <br key={`br-${i}`} />;
      } else if (part.trim() === "") {
        return (
          <span key={`space-${i}`} className="heading-animated-word space">
            {part}
          </span>
        );
      } else {
        return (
          <span
            key={`word-${i}`}
            className="heading-animated-word desc-word"
            // Initial state for animation; GSAP in SensorHero will animate these
          >
            {part}
          </span>
        );
      }
    });
  };

  const alignmentClass = alignLeft ? "align-left" : "align-center";
  const textAlignmentClass = alignLeft ? "text-left" : "text-center";
  const buttonWrapperClass = alignLeft ? "align-left" : "align-center";

  // Extract className from props objects to avoid conflicts
  const { className: labelPropsClassName, ...restLabelProps } = labelProps;
  const { className: mainHeadingPropsClassName, ...restMainHeadingProps } = mainHeadingProps;
  const { className: subHeadingPropsClassName, ...restSubHeadingProps } = subHeadingProps;

  return (
    <div
      className={`heading ${alignmentClass} ${containerClassName}`.trim()}
      {...containerProps}
    >
      {labelText && (
        <div
          className={`heading-label ${textAlignmentClass} ${labelClassName} ${labelPropsClassName || ""}`.trim()}
          {...restLabelProps}
        >
          <span className="heading-label-icon">♠</span>
          <p className="heading-label-text">
            {labelText}
          </p>
        </div>
      )}

      {mainHeading && (
        <MainHeadingTag
          className={`heading-main-heading ${textAlignmentClass} ${mainHeadingClassName} ${mainHeadingPropsClassName || ""}`.trim()}
          {...restMainHeadingProps}
        >
          {renderText(mainHeading, false)}{" "}
          {/* Main heading *never* splits words for animation */}
        </MainHeadingTag>
      )}

      {subHeading && (
        <p
          className={`heading-subheading ${textAlignmentClass} ${subHeadingClassName} ${subHeadingPropsClassName || ""}`.trim()}
          {...restSubHeadingProps}
        >
          {renderText(subHeading, animateSubHeadingWords)}{" "}
          {/* Subheading *conditionally* splits words */}
        </p>
      )}

      {/* Button rendering */}
      {btnText && (
        <div className={`heading-button-wrapper ${buttonWrapperClass}`}>
          <Button to={btnUrl} variant={btnVariant} {...btnProps}>
            {btnText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Heading;

/*
 ============================================
 HOW TO USE THIS COMPONENT
 ============================================

 // Example 1: Center-aligned heading with all props
 <Heading
    labelText="Featured Product"
    labelClassName="custom-label-class"
    labelProps={{ id: "label", "data-testid": "heading-label" }}
    mainHeading="Welcome to Our<br/>Amazing Platform"
    mainHeadingLevel="h1"
    mainHeadingClassName="custom-heading-class"
    mainHeadingProps={{ id: "main-heading", "data-testid": "main-heading" }}
    subHeading="Discover our features<br/>and benefits today"
    subHeadingClassName="custom-subheading-class"
    subHeadingProps={{ id: "sub-heading", "data-testid": "sub-heading" }}
    btnText="Get Started"
    btnUrl="/signup"
    btnVariant="underline-arrow"
    btnProps={{ textColor: "#000", iconColor: "#000" }}
    alignLeft={false}
    containerClassName="custom-container-class"
    containerProps={{ id: "heading-container", "data-section": "hero" }}
    animateSubHeadingWords={true}
 />

 // Example 2: Left-aligned heading with all props
 <Heading
    labelText="About Us"
    labelClassName="about-label-class"
    labelProps={{ id: "about-label" }}
    mainHeading="Our Mission<br/>and Vision"
    mainHeadingLevel="h2"
    mainHeadingClassName="about-heading-class"
    mainHeadingProps={{ id: "about-heading" }}
    subHeading="Learn about our mission<br/>and values that drive us"
    subHeadingClassName="about-subheading-class"
    subHeadingProps={{ id: "about-subheading" }}
    btnText="Learn More"
    btnUrl="/about"
    btnVariant="primary"
    btnProps={{ backgroundColor: "#007bff", textColor: "#fff" }}
    alignLeft={true}
    containerClassName="about-container-class"
    containerProps={{ id: "about-container", "data-section": "about" }}
    animateSubHeadingWords={false}
 />
*/
