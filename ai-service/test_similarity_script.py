from similarity import calculate_similarity

def run_tests():
    test_cases = [
        {
            "desc": "Identical Answers",
            "ref": "DBMS is software used to manage databases.",
            "std": "DBMS is software used to manage databases."
        },
        {
            "desc": "Semantically Similar, Different Wording",
            "ref": "An operating system is system software that manages hardware resources and provides services to applications.",
            "std": "OS controls computer hardware and provides an environment for programs to run."
        },
        {
            "desc": "Somewhat Related",
            "ref": "DBMS is software used to manage databases.",
            "std": "DBMS is software that stores and manages data efficiently."
        },
        {
            "desc": "Completely Different",
            "ref": "What is an Operating System?",
            "std": "The capital of France is Paris and it is famous for the Eiffel Tower."
        }
      ]

    print("\n=== STARTING S-BERT SIMILARITY TESTS ===\n")
    for idx, case in enumerate(test_cases, 1):
        print(f"Test Case {idx}: {case['desc']}")
        print(f"  Reference: {case['ref']}")
        print(f"  Student:   {case['std']}")
        try:
            score = calculate_similarity(case['ref'], case['std'])
            print(f"  --> Score:  {score:.4f} ({score * 100:.1f}% Similarity)")
        except Exception as e:
            print(f"  --> Error:  {e}")
        print("-" * 50)

if __name__ == "__main__":
    run_tests()
