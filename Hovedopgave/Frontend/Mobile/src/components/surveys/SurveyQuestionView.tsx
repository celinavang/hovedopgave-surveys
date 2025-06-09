import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput } from "react-native";

const QuestionTypeEnum = {
    RATING: "RATING",
    SINGLE: "SINGLE",
    TEXTINPUT: "TEXTINPUT" ,
    LIKERT: "LIKERT" // to do 
};

export const SurveyQuestionView = () => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // Example progress data
    const currentQuestion = 4;
    const totalQuestions = 5;
    const progress = currentQuestion / totalQuestions;

    // Example question data
    const question = {
        type: QuestionTypeEnum.SINGLE, // Change to RATING, SINGLE, TEXTINPUT to test different types
        question: "Hvordan har du det i dag?",
        required: true,
        questionOptions: [
            { id: 1, text: "Godt" },
            { id: 2, text: "Fantastisk" },
            { id: 3, text: "Ved ikke" },
            { id: 4, text: "Dårligt" },
            { id: 5, text: "Meget dårligt" }
        ],
    };

    const renderQuestionType = () => {
        switch (question.type) {
            case QuestionTypeEnum.RATING:
                return (
                    <View style={{ flexDirection: "row", gap: 8, marginVertical: 8}}>
                        {question.questionOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => setSelectedOption(option.id)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={selectedOption && option.id <= selectedOption ? "star" : "star-outline"}
                                    size={32}
                                    color={selectedOption && option.id <= selectedOption ? "orange" : "#d1d5db"}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case QuestionTypeEnum.SINGLE:
                return (
                    <View style={{ marginVertical: 8 }}>
                        {question.questionOptions.map((option) => {
                            const isSelected = selectedOption === option.id;
                            return (
                                <TouchableOpacity
                                    key={option.id}
                                    onPress={() => setSelectedOption(option.id)}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginVertical: 8,
                                        backgroundColor: isSelected ? "#ede9fe" : "white",
                                        borderRadius: 12,
                                        padding: 16,
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 6,
                                        elevation: 2,
                                        borderWidth: 1,
                                        borderColor: isSelected ? "#a14acf" : "gray",
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <View style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 10,
                                        borderWidth: 2,
                                        borderColor: isSelected ? "#a14acf" : "gray",
                                        backgroundColor: isSelected ? "#a14acf" : "white",
                                        marginRight: 8,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        {isSelected && (
                                            <Ionicons name="checkmark" size={16} color="white" />
                                        )}
                                    </View>
                                    <Text style={{ color: isSelected ? "#a14acf" : "#222", fontWeight: isSelected ? "bold" : "normal" }}>
                                        {option.text}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                );
            case QuestionTypeEnum.TEXTINPUT:
                return (
                    <TextInput
                        placeholder="Skriv dit svar her"
                        style={{
                            width: "100%",
                            padding: 16,
                            borderWidth: 1,
                            borderColor: "gray",
                            borderRadius: 6,
                            marginTop: 8,
                            minHeight: 100, 
                            textAlignVertical: "top",
                            fontSize: 16,
                        }}
                        editable={true}
                        multiline
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {/* Progress bar */}
            <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20, backgroundColor: "white", }}>
                <View style={{
                    height: 8,
                    backgroundColor: "#ced0d6",
                    borderRadius: 4,
                    overflow: "hidden",
                }}>
                    <View style={{
                        width: `${progress * 100}%`,
                        height: "100%",
                        backgroundColor: "#a14acf",
                        borderRadius: 4,
                    }} />
                </View>
                <Text style={{ marginTop: 4, color: "#9ca3af", fontSize: 12, fontWeight: "bold", justifyContent: "center", textAlign: "center" }}>
                    {`Spørgsmål ${currentQuestion} af ${totalQuestions}`}
                </Text>
            </View>
            {/* Progress bar */}
            <View style={{ padding: 16, marginBottom: 8, }}>
                <Text style={{ fontSize: 14, fontWeight: "bold", color: "#9ca3af", marginBottom: 2 }}>
                    Spørgsmål 1
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "#4d524d", paddingBottom: 8 }}>
                    {question.question}
                </Text>
                {question.required && (
                    <Text style={{ color: "#9ca3af", fontSize: 12, fontWeight: "bold" }}>
                        Besvarelse påkrævet*
                    </Text>
                )}
                {renderQuestionType()}
            </View>
        </View>
    );
}

