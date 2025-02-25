import { css, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { SvgIcon, SvgIconProps } from "@material-ui/core";
import { FC } from "react";
import { getColors, getIconSizes, Props } from "../styles";
import { IconNameToSizes } from "./map";

export interface ExtraProps<IconName extends keyof IconNameToSizes>
  extends Props {
  sdsIcon: IconName;
  sdsSize: IconNameToSizes[IconName];
  sdsType: "iconButton" | "interactive" | "static";
}

function iconSize<IconName extends keyof IconNameToSizes>(
  props: ExtraProps<IconName>
): SerializedStyles {
  const { sdsSize } = props;
  const iconSizes = getIconSizes(props);

  return css`
    height: ${iconSizes?.[sdsSize]?.height}px;
    width: ${iconSizes?.[sdsSize]?.width}px;
  `;
}

function staticStyle<IconName extends keyof IconNameToSizes>(
  props: ExtraProps<IconName>
): SerializedStyles {
  const colors = getColors(props);

  return css`
    color: ${colors?.primary[400]};
  `;
}

function interactive<IconName extends keyof IconNameToSizes>(
  props: ExtraProps<IconName>
): SerializedStyles {
  const colors = getColors(props);

  return css`
    color: ${colors?.gray[500]};

    &:hover {
      color: ${colors?.gray[600]};
    }

    &:active {
      color: ${colors?.primary[400]};
    }

    &:disabled {
      color: ${colors?.gray[300]};
    }
  `;
}

const doNotForwardProps = ["sdsIcon", "sdsSize", "sdsType"];

type StyledSvgIconProps<IconName extends keyof IconNameToSizes> =
  ExtraProps<IconName> &
    CustomSVGProps &
    SvgIconProps<"svg", { component: FC<CustomSVGProps> }>;

export const StyledSvgIcon = styled(SvgIcon, {
  shouldForwardProp: (prop) => !doNotForwardProps.includes(prop as string),
})`
  ${<IconName extends keyof IconNameToSizes>(
    props: StyledSvgIconProps<IconName>
  ) => {
    const { sdsType } = props;

    return css`
      ${sdsType !== "iconButton" && iconSize(props)}
      ${sdsType === "static" && staticStyle(props)}
      ${sdsType === "interactive" && interactive(props)}
    `;
  }}
`;

export const StyledIcon = styled.div`
  display: contents;
`;
