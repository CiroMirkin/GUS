import { Platform } from "react-native"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface Props {
    value: Date
    mode: "date" | "time"
    onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void
}

function DateTimeInput({ value, mode, onChange }: Props) {
    if (Platform.OS === "web") {
        return (
            <DatePicker
                selected={value}
                onChange={(date: Date | null) => {
                    if (!date) return
                    onChange({ type: "set" } as DateTimePickerEvent, date)
                }}
                showTimeSelect={mode === "time"}
                showTimeSelectOnly={mode === "time"}
                timeIntervals={5}
                timeCaption="Hora"
                dateFormat={mode === "time" ? "HH:mm" : "dd/MM/yyyy"}
                timeFormat="HH:mm"
                locale="es"
            />
        )
    }

    return (
        <DateTimePicker
            value={value}
            mode={mode}
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
        />
    )
}

export default DateTimeInput
