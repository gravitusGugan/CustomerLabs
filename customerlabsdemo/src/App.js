import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Box,
  IconButton,
  List,
  ListItem,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, red } from "@mui/material/colors";
import "./App.css"; // Import the CSS file for global styles

// Create a custom theme to use Montserrat as the default font
const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
});

// Schema options available for selection
const schemaOptions = [
  { label: "First Name", value: "first_name", color: "green" },
  { label: "Last Name", value: "last_name", color: "green" },
  { label: "Gender", value: "gender", color: "green" },
  { label: "Age", value: "age", color: "green" },
  { label: "Account Name", value: "account_name", color: "red" },
  { label: "City", value: "city", color: "red" },
  { label: "State", value: "state", color: "red" },
];

const initialSchemas = schemaOptions.slice(0, 2);
const remainingSchemas = schemaOptions.slice(2);

const App = () => {
  const [open, setOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchema, setSelectedSchema] = useState("");
  const [schemaList, setSchemaList] = useState(initialSchemas);
  const [availableSchemas, setAvailableSchemas] = useState(remainingSchemas);

  // Handle opening of the drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // Handle closing of the drawer
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Add selected schema to the list
  const handleAddSchema = () => {
    if (selectedSchema) {
      const schemaToAdd = availableSchemas.find(
        (schema) => schema.value === selectedSchema
      );
      if (schemaToAdd) {
        setSchemaList([...schemaList, schemaToAdd]);
        setAvailableSchemas(
          availableSchemas.filter((schema) => schema.value !== selectedSchema)
        );
        setSelectedSchema("");
      }
    }
  };

  // Remove schema from the list
  const handleRemoveSchema = (index) => {
    const newSchemaList = [...schemaList];
    const removedSchema = newSchemaList.splice(index, 1)[0];
    setSchemaList(newSchemaList);
    setAvailableSchemas([...availableSchemas, removedSchema]);
  };

  // Handle schema type change
  const handleSchemaChange = (index, newValue) => {
    const newSchemaList = [...schemaList];
    const updatedSchema = schemaOptions.find(
      (option) => option.value === newValue
    );
    if (updatedSchema) {
      newSchemaList[index] = updatedSchema;
      setSchemaList(newSchemaList);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData("index");
    if (draggedIndex === null) return;

    const updatedSchemaList = [...schemaList];
    const [draggedItem] = updatedSchemaList.splice(draggedIndex, 1);
    updatedSchemaList.splice(index, 0, draggedItem);

    setSchemaList(updatedSchemaList);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Save the segment and log it to console
  const handleSaveSegment = () => {
    const segmentData = {
      segment_name: segmentName,
      schema: schemaList.map((schema) => ({
        [schema.value]: schema.label,
      })),
    };
    console.log(segmentData);
    handleDrawerClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <div >
        <AppBar position="static" sx={{ bgcolor: "#00BBAB" }}>
          <Toolbar>
            <KeyboardArrowLeftIcon />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              View Audience
            </Typography>
          </Toolbar>
        </AppBar>
        <Button
          variant="outlined"
          onClick={handleDrawerOpen}
          sx={{ mt: 2 }}
       
        >
          Save Segment
        </Button>

        <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
          <AppBar position="static" sx={{ bgcolor: "#00BBAB" }}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Save Segment
              </Typography>
              <IconButton
                onClick={handleDrawerClose}
                edge="end"
                color="inherit"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box sx={{ width: 600, padding: 2 }}>
            <Typography>Enter the Name of the Segment</Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Segment Name"
              placeholder="Name of Segment"
              fullWidth
              variant="outlined"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              size="small" // Set TextField to small size
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              To save your segment, you need to add the schemas to build the
              query
            </Typography>
            <Box mt={2} p={2}>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <span style={{ color: green[500] }}>● User Traits</span> -{" "}
                <span style={{ color: red[500] }}>● Group Traits</span>
              </Typography>
            </Box>
            <Box
              mt={2}
              p={2}
              border={1}
              borderRadius={4}
              borderColor="grey.400"
            >
              <List>
                {schemaList.map((schema, index) => (
                  <ListItem
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <DragIndicatorIcon />
                      </Grid>
                      <Grid item xs>
                        <FormControl fullWidth size="small">
                          <InputLabel>{schema.label}</InputLabel>
                          <Select
                            label={schema.label}
                            value={schema.value}
                            onChange={(e) =>
                              handleSchemaChange(index, e.target.value)
                            }
                            renderValue={() => (
                              <Box display="flex" alignItems="center">
                                <span
                                  style={{
                                    color:
                                      schema.color === "green"
                                        ? green[500]
                                        : red[500],
                                    marginRight: 8,
                                  }}
                                >
                                  ●
                                </span>
                                {schema.label}
                              </Box>
                            )}
                          >
                            {schemaOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                <span
                                  style={{
                                    color:
                                      option.color === "green"
                                        ? green[500]
                                        : red[500],
                                    marginRight: 8,
                                  }}
                                >
                                  ●
                                </span>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveSchema(index)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            </Box>
            <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
              <InputLabel>Add schema to segment</InputLabel>
              <Select
                label="Add schema to segment"
                value={selectedSchema}
                onChange={(e) => setSelectedSchema(e.target.value)}
                renderValue={(value) => (
                  <Box display="flex" alignItems="center">
                    <span
                      style={{
                        color:
                          availableSchemas.find(
                            (option) => option.value === value
                          ).color === "green"
                            ? green[500]
                            : red[500],
                        marginRight: 8,
                      }}
                    >
                      ●
                    </span>
                    {
                      availableSchemas.find((option) => option.value === value)
                        .label
                    }
                  </Box>
                )}
              >
                {availableSchemas.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <span
                      style={{
                        color: option.color === "green" ? green[500] : red[500],
                        marginRight: 8,
                      }}
                    >
                      ●
                    </span>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button color="primary" onClick={handleAddSchema} sx={{ mt: 2 }}>
              + Add new schema
            </Button>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                onClick={handleSaveSegment}
                color="primary"
                variant="contained"
                sx={{ bgcolor: "#00BBAB", mr: 1 }}
              >
                Save Segment
              </Button>
              <Button
                onClick={handleDrawerClose}
                color="secondary"
                variant="outlined"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Drawer>
      </div>
    </ThemeProvider>
  );
};

export default App;
