import { CheckboxProps as MUICheckboxProps, SvgIcon } from "@material-ui/core";
import React from "react";
import { ReactComponent as IconCheckboxChecked } from "../../common/svgs/IconCheckboxChecked.svg";
import { ReactComponent as IconCheckboxIndeterminate } from "../../common/svgs/IconCheckboxIndeterminate.svg";
import { ReactComponent as IconCheckboxUnchecked } from "../../common/svgs/IconCheckboxUnchecked.svg";
import { StyledCheckbox } from "./styles";

export interface CheckboxProps
  extends Omit<MUICheckboxProps, "color" | "defaultChecked" | "indeterminate"> {
  stage: "checked" | "unchecked" | "indeterminate";
}

const Checkbox = (props: CheckboxProps): JSX.Element => {
  let newProps: MUICheckboxProps;
  switch (props.stage) {
    case "checked":
      newProps = {
        ...props,
        checked: true,
        color: "primary",
      };
      break;
    case "unchecked":
      newProps = {
        ...props,
        checked: false,
        color: "default",
      };
      break;
    case "indeterminate":
      newProps = {
        ...props,
        checked: true,
        color: "primary",
        indeterminate: true,
      };
      break;
    default:
      newProps = props;
  }

  return (
    <StyledCheckbox
      {...newProps}
      checkedIcon={
        <SvgIcon
          fillcontrast="white"
          component={IconCheckboxChecked}
          viewBox="0 0 16 16"
        />
      }
      icon={
        <SvgIcon
          fillcontrast="white"
          component={IconCheckboxUnchecked}
          viewBox="0 0 16 16"
        />
      }
      indeterminateIcon={
        <SvgIcon
          fillcontrast="white"
          component={IconCheckboxIndeterminate}
          viewBox="0 0 16 16"
        />
      }
    />
  );
};

export default Checkbox;
