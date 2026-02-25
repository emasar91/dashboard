import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { SearchIcon } from "lucide-react"

interface SearchBarProps {
  placeholder: string
  title: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function SearchBar({ placeholder, title, value, onChange }: SearchBarProps) {
  return (
    <Field>
      <FieldLabel htmlFor="input-button-group">{title}</FieldLabel>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput
            id="inline-start-input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </Field>
  )
}

export default SearchBar
