import { AutocompleteCloseReason, Value as MUIValue } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import InputDropdown, {
  InputDropdownProps as InputDropdownPropsType,
} from "../InputDropdown";
import MenuSelect, { DefaultMenuSelectOption } from "../MenuSelect";
import { StyledPaper, StyledPopper } from "./style";

export {
  StyledPopper as DropdownPopper,
  StyledPaper as DropdownPaper,
  InputDropdown as DropdownInputDropdown,
};

// (thuang): Value's type is based on generic type placeholder (T) and Multiple
// type. If Multiple is true, Value's type is T[] | null.
// Otherwise, Value's type is T | null.
// Conditional Type
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
export type Value<T, Multiple> = Multiple extends undefined | false
  ? T | null
  : Array<T> | null;

interface DropdownProps<Multiple> {
  label: string;
  options: DefaultMenuSelectOption[];
  onChange: (options: Value<DefaultMenuSelectOption, Multiple>) => void;
  multiple?: Multiple;
  search?: boolean;
  MenuSelectProps?: Partial<typeof MenuSelect>;
  InputDropdownProps?: Partial<InputDropdownPropsType>;
  value?: Value<DefaultMenuSelectOption, Multiple>;
  style?: React.CSSProperties;
  className?: string;
  PopperComponent?: typeof StyledPopper;
  PaperComponent?: typeof StyledPaper;
  InputDropdownComponent?: typeof InputDropdown;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function Dropdown<Multiple extends boolean | undefined = false>({
  options,
  label = "",
  multiple = false,
  search = false,
  onChange,
  MenuSelectProps = {},
  InputDropdownProps = { sdsStyle: "minimal" },
  value: propValue,
  PopperComponent = StyledPopper,
  PaperComponent = StyledPaper,
  InputDropdownComponent = InputDropdown,
  ...rest
}: DropdownProps<Multiple>): JSX.Element {
  const isControlled = propValue !== undefined;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [value, setValue] = useState<Value<DefaultMenuSelectOption, Multiple>>(
    getInitialValue()
  );

  const [pendingValue, setPendingValue] = useState<
    Value<DefaultMenuSelectOption, true>
  >([]);

  useEffect(() => {
    onChange(value);
  }, [value]);

  useEffect(() => {
    if (isControlled) {
      setValue(propValue);
    }
  }, [propValue]);

  const open = Boolean(anchorEl);

  return (
    <>
      <InputDropdownComponent
        label={label}
        onClick={handleClick}
        sdsStage={open ? "userInput" : "default"}
        {...InputDropdownProps}
        {...rest}
      />
      <PopperComponent open={open} anchorEl={anchorEl}>
        <MenuSelect
          open
          search={search}
          onClose={handleClose}
          multiple={multiple as Multiple}
          PaperComponent={PaperComponent}
          value={
            (multiple ? pendingValue : value) as MUIValue<
              DefaultMenuSelectOption,
              Multiple,
              undefined,
              undefined
            >
          }
          onChange={handleChange}
          disableCloseOnSelect={multiple}
          options={options}
          {...MenuSelectProps}
        />
      </PopperComponent>
    </>
  );

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    if (multiple) {
      setPendingValue(value as DefaultMenuSelectOption[]);
    }

    setAnchorEl(event.currentTarget);
  }

  function handleClose(
    _: React.ChangeEvent<unknown>,
    reason: AutocompleteCloseReason
  ) {
    // (thuang): We don't want to close the menu when the input is clicked
    if (reason === "toggleInput") {
      return;
    }

    if (multiple) {
      setValue(pendingValue as Value<DefaultMenuSelectOption, Multiple>);
    }

    if (anchorEl) {
      anchorEl.focus();
    }

    setAnchorEl(null);
  }

  function handleChange(
    _: React.ChangeEvent<unknown>,
    newValue: DefaultMenuSelectOption | DefaultMenuSelectOption[] | null
  ) {
    if (multiple) {
      return setPendingValue(newValue as DefaultMenuSelectOption[]);
    }

    setValue(newValue as Value<DefaultMenuSelectOption, Multiple>);
  }

  function getInitialValue(): Value<DefaultMenuSelectOption, Multiple> {
    if (isControlled) {
      return propValue;
    }

    return multiple
      ? ([] as unknown as Value<DefaultMenuSelectOption, Multiple>)
      : null;
  }
}
