import PropTypes from "prop-types"; // Thêm PropTypes để kiểm tra kiểu dữ liệu
import { Autocomplete, TextField } from "@mui/material";

const Search = ({ setValue, value, setInputValue, inputValue, options }) => {
  return (
    <div>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        sx={{ width: 300 }}
        options={options}
        getOptionLabel={(option) => option.name} // Hiển thị tên của option
        renderInput={(params) => <TextField {...params} label="Chọn nhà đài" />}
      />
    </div>
  );
};

// Kiểm tra kiểu dữ liệu của props
Search.propTypes = {
  setValue: PropTypes.func.isRequired,
  value: PropTypes.object,
  setInputValue: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default Search;
